import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from "./login/login.component";
import { RecoverComponent } from "./recover/recover.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule, 
        AuthRoutingModule,
        LoginComponent,
        RecoverComponent,
        SignupComponent,
        ChangePasswordComponent,
    ],
    exports: [
        LoginComponent,
        RecoverComponent,
        SignupComponent,
        ChangePasswordComponent,
    ]
})
export class AuthModule { }


