import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prependAt',
  standalone: true
})
export class PrependAtPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return value;
    }
    return '@' + value;
  }
}
