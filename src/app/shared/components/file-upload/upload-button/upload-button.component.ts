import { Component, EventEmitter, Output } from '@angular/core';
import { Attachment } from '../file-upload.model';
import { FileUploadService } from '../file-upload.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-upload-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.css']
})
export class UploadButtonComponent {

  busy: boolean = false;

  @Output() uploaded = new EventEmitter<Attachment[]>();

  constructor(private uploadService: FileUploadService,
    private as: AuthService) { }

  async upload(event: any): Promise<void> {

    const selectedFiles: FileList = event.target.files;

    let attachments: Attachment[] = [];

    try {
      this.busy = true;

      attachments = await this.uploadService.pushFileToStorage(
         selectedFiles, 'claims', 
         this.as.user()!.uid
      );
    } finally {
      this.busy = false;
    }

    this.uploaded.emit(attachments);
  }
}
