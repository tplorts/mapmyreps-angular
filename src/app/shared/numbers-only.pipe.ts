import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numbersOnly'
})
export class NumbersOnlyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return String(value).replace(/[^\d]/g, '');
  }

}
