import { Component } from '@angular/core';
import { ToolbarComponent } from '../../shared/components/toolbar.component';
import { ReconcilationService } from '../reconcilation.service';
import { UploadButtonComponent } from '../../shared/components/file-upload/upload-button/upload-button.component';
import { ResolutionListComponent } from '../reconcilation-list/reconcilationlist.component';

@Component({
  selector: 'app-reconcilation',
  standalone: true,
  imports: [ToolbarComponent, UploadButtonComponent, ResolutionListComponent],
  templateUrl: './reconcilation.component.html',
  styleUrl: './reconcilation.component.scss'
})
export class ReconcilationComponent {


  constructor(public rs: ReconcilationService) {}

  uploadfile() {
    
  }

  resolve() {

  }

}
