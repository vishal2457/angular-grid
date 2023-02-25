import { Pipe, PipeTransform } from '@angular/core';
import { OPTION_TITLES } from '../data-grid.type';

@Pipe({
  name: 'renderTitle'
})
export class RenderTitlePipe implements PipeTransform {
  transform(value: string): string {
    console.log(value);

    return OPTION_TITLES[value]
  }

}
