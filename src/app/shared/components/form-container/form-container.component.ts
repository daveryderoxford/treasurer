import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FlexModule, FlexLayoutModule } from '@ngbracket/ngx-layout';

@Component({
  selector: 'app-form-container',
  standalone: true,
  imports: [FlexModule, FlexLayoutModule, MatCardModule],
  templateUrl: './form-container.component.html',
  styleUrl: './form-container.component.scss'
})
export class FormContainerComponent {
  error = input('');
}
