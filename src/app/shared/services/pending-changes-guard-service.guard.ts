import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogsService } from '../dialogs/dialogs.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard  {

  constructor(private ds: DialogsService) { }

  async canDeactivate(component: ComponentCanDeactivate): Promise<boolean> {
    if (component.canDeactivate()) {
      return true;
    } else {
      return await this.ds.confirm(' Unsaved changes',
        'You have unsaved changes.  \n Press Cancel to go back and save these changes, or OK to lose these changes.');
    }
  }
}
