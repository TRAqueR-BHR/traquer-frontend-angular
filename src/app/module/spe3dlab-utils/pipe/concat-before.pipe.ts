import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concatBefore'
})
// See https://github.com/nglrx/pipes/tree/master/packages/pipes/src/lib/string#concat
export class ConcatBeforePipe implements PipeTransform {

  transform(value: string, stringBefore: string): string {

    if (value == null) {
      return null
    }

    return stringBefore + value;
  }

}