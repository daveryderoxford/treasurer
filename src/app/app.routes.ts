import { Routes } from '@angular/router';
import { ClaimListComponent } from './expense-claim/claim-list/claim-list.component';
import { ClaimAddComponent } from './expense-claim/claim-add.component';
import { ClaimEditComponent } from './expense-claim/claim-edit.component';
import { PendingChangesGuard } from './shared/services/pending-changes-guard-service.guard';
import { AuthGuard } from './auth/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/claims', pathMatch: 'full' },
    { path: "claims", component: ClaimListComponent, canActivate: [AuthGuard] },
    { path: 'claims/add', component: ClaimAddComponent, canDeactivate: [PendingChangesGuard], canActivate: [AuthGuard] },
    { path: 'claims/edit/:id', component: ClaimEditComponent, canDeactivate: [PendingChangesGuard], canActivate: [AuthGuard] }, 
    { path: "auth", loadChildren: () => import( './auth/auth.module' ).then( m => m.AuthModule ) },
    { path: "user", loadChildren: () => import( './user/user.module' ).then( m => m.UserModule ) },
 ];
