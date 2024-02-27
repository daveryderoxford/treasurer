import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToolbarComponent } from '../shared/components/toolbar.component';
import { UserDataService } from '../user/user-data.service';
import { UserData } from '../user/user.model';
import { ClaimFormComponent } from './claim-form/claim-form.component';
import { Claim } from './claim.model';
import { ClaimService } from './claim.service';
import { UserClaimFormComponent } from './user-claim-form/user-claim-form.component';

@Component({
  selector: 'app-claim-add',
  template: `
    <app-toolbar title="IBRSC - New expense claim"></app-toolbar>
    @if (auth.isTreasurer()) {
      <app-claim-form #claimform (submitted)="submitted($event)"></app-claim-form>
    } @else {
      <app-user-claim-form #claimform (submitted)="submitted($event)"></app-user-claim-form>
    }
  `,
  styles: [],
  standalone: true,
  imports: [ClaimFormComponent, ToolbarComponent, UserClaimFormComponent]
})
export class ClaimAddComponent {

  private createClaim(userData: UserData, formData: Partial<Claim>, isExternal: boolean): Claim {
    const defaultClaim: Claim = {
      id: '',
      userId: userData.id,
      source: isExternal ? 'External' : 'Internal',
      attachments: [],
      name: userData.name,
      email: userData.email,
      bankAccountHolder: userData.bankAccountHolder,
      bankAccountNo: userData.bankAccountNo,
      bankSortCode: userData.bankSortCode,
      amount: 0,
      state: 'Submitted',
      reason: '',
      description: '',
      dateSubmitted: new Date(),
    }
    return { ...defaultClaim, ...formData };
  }

  @ViewChild('claimform') claimForm: ClaimFormComponent | undefined;

  constructor(
    private fs: ClaimService,
    private router: Router,
    public auth: AuthService,
    public us: UserDataService) { }

  async submitted(formData: Partial<Claim>) {
    const claim = this.createClaim(this.us.user()!, formData, this.auth.isTreasurer());
    await this.fs.add(claim);
    this.router.navigate(["/claims"]);
  }

  canDeactivate(): boolean {
    return this.claimForm!.canDeactivate();
  }
}