import { Component, EventEmitter, Output, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Attachment } from '../file-upload.model';
import { FileUploadService } from '../file-upload.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.css'],
  standalone: true,
  imports: [MatListModule, MatIconModule, MatButtonModule],
})
export class UploadListComponent {

  files = input<Attachment[]>([]);
  canDelete = input<boolean>(true);

  @Output() deleted = new EventEmitter<Attachment>();
      
  constructor(public uploadService: FileUploadService) {  }

  deleteFileUpload(fileUpload: Attachment): void {
    this.deleted.emit(fileUpload);
    this.uploadService.deleteFile(fileUpload);
  }
}
