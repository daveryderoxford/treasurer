import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../user/user-data.service';

// TODO n ot working on invocaton after reload  currently - not configured in router configuration

/* Ensure bank account details are populated before navigatiob to add claim */
export const claimGuard: CanActivateFn = (route, state) => {
  const user = inject(UserDataService).user();
  const router = inject(Router);

  const canNavigate = user &&
    user.bankAccountHolder !== null &&
    user.bankAccountNo !== null &&
    user.bankSortCode !== null;

  if (canNavigate) {
    return true;
  } else {
    router.navigate(['/user']);
    return false;
  }
};
