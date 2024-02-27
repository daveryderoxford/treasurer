import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MessageDialogComponent } from "./message-dialog.component";

@Injectable({
    providedIn: 'root',
  })
export class DialogsService {

    constructor(private dialog: MatDialog) { }

    public async confirm(title: string, message: string): Promise<boolean> {

        let dialogRef: MatDialogRef<ConfirmDialogComponent>;

        dialogRef = this.dialog.open(ConfirmDialogComponent);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed().toPromise();
    }

    public async message(title: string, message: string): Promise<boolean> {

        let dialogRef: MatDialogRef<MessageDialogComponent>;

        dialogRef = this.dialog.open(MessageDialogComponent);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed().toPromise();
    }
}
