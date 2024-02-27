import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { ToolbarComponent } from '../../shared/components/toolbar.component';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: true,
    imports: [ToolbarComponent, FlexModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, MatButtonModule, RouterLink]
})
export class SignupComponent {
    signupForm: UntypedFormGroup;
    error = '';

    constructor(private router: Router,
        private formBuilder: UntypedFormBuilder,
        private afAuth: Auth) {
        this.signupForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        }, { validator: this.passwordMissMatch });

    }

    passwordMissMatch(g: UntypedFormGroup): any {
        const p1 = g.get('password')!;
        const p2 = g.get('confirmPassword')!;
        let ret: { [error: string]: any } = {};

        if ((p1.touched || p2.touched) &&
            (p1.value !== p2.value) &&
            (p2 !== null)) {
            ret = { passwordMissMatch: true };
        }

        return (ret);
    }

    async signup() {

        const email = this.signupForm.get('email')!.value!;
        const password = this.signupForm.get('password')!.value!;

        this.error = '';

        try {
            await createUserWithEmailAndPassword(this.afAuth, email, password);

            // User is automatically signed in so get the current user and send verification email
            const user = await this.afAuth.currentUser;
            if (user) {
                sendEmailVerification(user)
            } else {
                console.log('User enexpectely null');
            }

            this.router.navigateByUrl('/user');

        } catch (error) {
            if (error instanceof Error) {
                console.log('SignupComponent: Error creating user code:' + error.message);
                this.error = error.message;
            } else {
                console.log('SignupComponent: unexpected error');
            }
        }
    }
}
