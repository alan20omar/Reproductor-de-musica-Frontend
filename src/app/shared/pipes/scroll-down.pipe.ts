import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scrollDown'
})
export class ScrollDownPipe implements PipeTransform {

  constructor() { }

  transform(array: any[], page: number): any[] {
    const result: any[] = array.slice(0, page * 5)
    return result;
  }

}
