
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
   selector: 'app-horizontal-rule',
   template: `<div class=hrule></div>`,
   styles: [".hrule { border-bottom: 1px solid rgb(209, 209, 209); width: 100%; text-align: center;}"],
   changeDetection: ChangeDetectionStrategy.OnPush,
   standalone: true,
   imports: []
})
export class HorizontalRuleComponent {

   constructor() { }

}