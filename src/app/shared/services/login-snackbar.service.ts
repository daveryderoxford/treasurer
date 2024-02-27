import { Injectable } from '@angular/core';
import { MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginSnackbarService {

  target: string | null = null;

  constructor(private snackbar: MatSnackBar,
              private router: Router) { }

  open(message: string, target?: string) {
    const snackBarRef = this.snackbar.open( message, "Login", { duration: 3000 });

    snackBarRef.onAction().subscribe( () => {
       this.router.navigate(["/auth/login"]);
       this.target = target!;
    } );
  }
}
