import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concat'
})
// See https://github.com/nglrx/pipes/tree/master/packages/pipes/src/lib/string#concat
export class ConcatPipe implements PipeTransform {

  transform(value: string, ...strings: string[]): string {
    return value && value.concat(...strings);
  }

}