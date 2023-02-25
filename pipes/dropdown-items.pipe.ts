import { Pipe, PipeTransform } from '@angular/core';
import { DataGridService } from '../data-grid.service';

@Pipe({
  name: 'getItems'
})
export class GetItemsPipe implements PipeTransform {
constructor(private _ds: DataGridService) {}
  transform(value: string): any[] {
    return this._ds.getFilterItems(value)
  }

}
