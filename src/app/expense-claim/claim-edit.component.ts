import { Component, OnInit, ViewChild, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToolbarComponent } from '../shared/components/toolbar.component';
import { ClaimFormComponent } from './claim-form/claim-form.component';
import { Claim } from './claim.model';
import { ClaimService } from './claim.service';
import { UserClaimFormComponent } from './user-claim-form/user-claim-form.component';

@Component({
  selector: 'app-claim-edit',
  template: `
     @defer {
      <app-toolbar [title]="title()"></app-toolbar>
    @if (auth.isTreasurer()) {
      <app-claim-form [claim]="claim()" #claimform (submitted)="submitted($event)"></app-claim-form>
    } @else {
      <app-user-claim-form [claim]="claim()" #claimform (submitted)="submitted($event)"></app-user-claim-form>
    }
  }
  `,
  styles: [],
  standalone: true,
  imports: [ClaimFormComponent, UserClaimFormComponent, ToolbarComponent]
})
export class ClaimEditComponent implements OnInit {

  id = signal<string | null>("");

  claim = computed<Claim>( 
    () => this.fs.claims().find((claim => claim.id === this.id()))!
  );

  title = computed( () => 'Edit claim  ' + this.id());
   
  @ViewChild('claimform') claimForm: UserClaimFormComponent | undefined;

  constructor(private fs: ClaimService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        this.id.set(params['id']);
    });
  }

  async submitted(data: Partial<Claim>) {
    await this.fs.update(this.id()!, data);
    this.router.navigate(["/claims"]);
  }

  canDeactivate(): boolean {
    return this.claimForm!.canDeactivate();
  }
}
