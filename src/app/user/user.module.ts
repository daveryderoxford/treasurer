import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from "./user-edit/user.component";
import { UserRoutingModule } from './user-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule( {
    imports: [
        CommonModule,
        UserRoutingModule,
        ReactiveFormsModule,
        UserComponent
    ],
    exports: [
        UserComponent
    ],
} )
export class UserModule { }
