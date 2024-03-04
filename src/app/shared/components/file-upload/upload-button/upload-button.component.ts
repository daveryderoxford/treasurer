import { Component, EventEmitter, Output } from '@angular/core';
import { Attachment } from '../file-upload.model';
import { FileUploadService } from '../file-upload.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../../auth/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload-button',
  standalone: true,
  imports: [CommonModule, MatTooltip, MatButtonModule, MatIconModule, MatProgressBarModule, MatInputModule],
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
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

  // Reyu tooltip text from a function to support multi-line
  getTooltipText(): string {
    return `Image or pdf.  
    For emails, print using 'Save to PDF'
    `;
  }
}
