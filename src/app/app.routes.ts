import { Routes } from '@angular/router';
import { ClaimListComponent } from './expense-claim/claim-list/claim-list.component';
import { ClaimAddComponent } from './expense-claim/claim-add.component';
import { ClaimEditComponent } from './expense-claim/claim-edit.component';
import { PendingChangesGuard } from './shared/services/pending-changes-guard-service.guard';
import { AuthGuard } from './auth/guards/auth-guard';
import { ReconcilationComponent } from './treasurer/reconcilation/reconcilation.component';
import { claimGuard } from './expense-claim/claim.guard';
import { InvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { InvoiceAddComponent } from './invoice/invoice-add.component';
import { InvoiceEditComponent } from './invoice/invoice-edit.component';

export const routes: Routes = [
    { path: '', redirectTo: '/claims', pathMatch: 'full' },
    { path: "claims", component: ClaimListComponent, canActivate: [AuthGuard], title: 'Claims' },
    { path: 'claims/add', component: ClaimAddComponent, canDeactivate: [PendingChangesGuard], canActivate: [AuthGuard],  title: 'Add Claim'},
    { path: 'claims/edit/:id', component: ClaimEditComponent, canDeactivate: [PendingChangesGuard], canActivate: [AuthGuard], title: 'Edit Claim' },
   
    { path: "invoices", component: InvoiceListComponent, canActivate: [AuthGuard], title: 'Invoices' },
    { path: 'invoices/add', component: InvoiceAddComponent, canDeactivate: [PendingChangesGuard], canActivate: [AuthGuard], title: 'Add Invoice' },
    { path: 'invoices/edit/:id', component: InvoiceEditComponent, canDeactivate: [PendingChangesGuard], canActivate: [AuthGuard], title: 'Edit Invoice' },

    { path: "treasurer", canActivate: [AuthGuard], children: [
        { path: "reconcilation", component: ReconcilationComponent, title: 'Bank reconcilation' },
    ]},
    { path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: "user", loadChildren: () => import('./user/user.module').then(m => m.UserModule) },

];

