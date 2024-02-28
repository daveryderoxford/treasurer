import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FlexModule } from '@ngbracket/ngx-layout';

@Component({
  selector: 'app-form-container',
  standalone: true,
  imports: [FlexModule, MatCardModule],
  templateUrl: './form-container.component.html',
  styleUrl: './form-container.component.scss'
})
export class FormContainerComponent {
  error = input('');
}
