import { Component, OnInit, Input} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-spinner',
    template: `
     @if (loading) {
     <div class="loading-spinner">
      <mat-spinner mode="indeterminate" color="accent" diameter="40" ></mat-spinner>
    </div>
     }
  `,
    styleUrls: ['./spinner.component.scss'],
    standalone: true,
    imports: [MatProgressSpinnerModule]
})
export class SpinnerComponent implements OnInit {

  @Input()
  loading = false;

  constructor() { }

  ngOnInit() {
  }

}
