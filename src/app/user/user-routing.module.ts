import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user-edit/user.component';
import { AuthGuard } from '../auth/guards/auth-guard';
import { PendingChangesGuard } from '../shared/services/pending-changes-guard-service.guard';

const routes: Routes = [
  { path: "", component: UserComponent, canActivate: [AuthGuard], canDeactivate: [PendingChangesGuard], title: 'User details' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
