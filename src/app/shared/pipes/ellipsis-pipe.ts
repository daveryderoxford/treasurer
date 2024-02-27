import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'ellipsis',
    standalone: true
})
export class EllipsisPipe implements PipeTransform {
   transform( val: string | null, args: number | undefined ) {
      if ( args === undefined ) {
         return val;
      }

      if ( val?.length > args ) {
         return val.substring( 0, args ) + '...';
      } else {
         return val;
      }
   }
}