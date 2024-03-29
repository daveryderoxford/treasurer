
import { Component, OnInit, effect } from "@angular/core";
import { Auth, User, authState } from "@angular/fire/auth";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { ExtendedModule } from "@ngbracket/ngx-layout/extended";
import { FlexModule } from "@ngbracket/ngx-layout/flex";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToolbarComponent } from "../../shared/components/toolbar.component";
import { UserDataService } from "../user-data.service";
import { UserData } from "../user.model";
import { FormContainerComponent } from "../../shared/components/form-container/form-container.component";
import { bankACValidator, sortCodeValidator } from '../../shared/validators';

@UntilDestroy()
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
  standalone: true,
  imports: [FormContainerComponent,ToolbarComponent, FlexModule, MatCardModule, ReactiveFormsModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ExtendedModule, MatSelectModule, MatOptionModule]
})
export class UserComponent implements OnInit {

  userForm = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.email, Validators.required] }),
    bankAccountHolder: new FormControl('', { validators: [Validators.required] }),
    bankAccountNo: new FormControl<number | null>(null, { validators: [Validators.required, bankACValidator] }),
    bankSortCode: new FormControl('', { validators: [Validators.required, sortCodeValidator] }),
  });

  showProgressBar = false;
  busy = false;

  constructor(
    private afAuth: Auth,
    private router: Router,
    private usd: UserDataService,
  ) {
    effect( () => {
      const userData = usd.user()
      if (userData) {
        this.userForm.reset();
        this.userForm.patchValue(userData);
      };
    });
  }

  ngOnInit() {
    authState(this.afAuth)
      .pipe(untilDestroyed(this))
      .subscribe(loggedIn => this.loginChanged(loggedIn as User));
  }

  loginChanged(loggedIn: User) {
    if (!loggedIn) {
      this.router.navigate(["/"]);
    }
  }

  async save() {

    this.busy = true;
    try {
      await this.usd.updateDetails(this.userForm.value as Partial<UserData>);
      console.log('UserComponnet: User results saved');
    } finally {
      this.busy = false;
      this.router.navigate(["/"]);
    }
  }

  canDeactivate(): boolean {
    return !this.userForm.dirty;
  }
}
