import { Component, OnInit } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { ToolbarComponent } from '../../shared/components/toolbar.component';

@Component({
    selector: 'app-recover',
    templateUrl: './recover.component.html',
    styleUrls: ['./recover.component.scss'],
    standalone: true,
    imports: [ToolbarComponent, FlexModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink]
})
export class RecoverComponent implements OnInit {

  recoverForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  error: string | null = '';

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private afAuth: Auth, 
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.recoverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async recover() {
    const emailAddress = this.recoverForm.get('email')!.value!;

    try {
      await sendPasswordResetEmail(this.afAuth, emailAddress );
      this.router.navigate( ["/auth/login"]);
    } catch (err) {
      console.log('RecoverComponent: Error requesting password reset for email');
      this.snackBar.open( 'Error requesting password reset for email', 'Close' , {duration: 3000});
    }
  }
}
