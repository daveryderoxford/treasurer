import { Component } from '@angular/core';
import { ToolbarComponent } from '../../shared/components/toolbar.component';
import { FormContainerComponent } from '../../shared/components/form-container/form-container.component';

@Component({
  selector: 'app-resolution',
  standalone: true,
  imports: [ToolbarComponent, FormContainerComponent],
  templateUrl: './resolution.component.html',
  styleUrl: './resolution.component.scss'
})
export class ResolutionComponent {
  

}
