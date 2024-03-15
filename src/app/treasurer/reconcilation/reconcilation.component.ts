import { Component, signal } from '@angular/core';
import { ToolbarComponent } from '../../shared/components/toolbar.component';
import { ReconciliationService } from '../reconcilation.service';
import { UploadButtonComponent } from '../../shared/components/file-upload/upload-button/upload-button.component';
import { ResolutionListComponent } from '../reconcilation-list/reconcilationlist.component';
import { ListContainerComponent } from '../../shared/components/list-container/list-container.component';
import { FlexLayoutModule, FlexModule } from '@ngbracket/ngx-layout';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reconcilation',
  standalone: true,
  imports: [ListContainerComponent, ToolbarComponent, FlexModule, FlexLayoutModule, UploadButtonComponent, MatButtonModule, ResolutionListComponent],
  templateUrl: './reconcilation.component.html',
  styleUrl: './reconcilation.component.scss'
})
export class ReconcilationComponent {

  constructor(public rs: ReconciliationService) { }

  busy = signal(false);

  async uploadfile(files: File[]) {

    if (files.length === 0) return;

    try {
      this.busy.set(true);
      await this.rs.readTransactionCSV(files[0]);
    } finally {
      this.busy.set(false);
    }
  }
  
  async save() {
    await this.rs.save();
  }

  cancel() {
    this.rs.cancel();
  }

  canDeactivate(): boolean {
    return !this.rs.inProgress;
  }

}
