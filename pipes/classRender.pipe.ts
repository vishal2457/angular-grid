import { Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/services/core/global-constants';
import { LocalStorageService } from 'src/app/services/core/local-storage.service';
import { DataGridService } from '../data-grid.service';
import { permissionType } from '../data-grid.type';

@Pipe({
  name: 'classRender',
})
export class classRenderPipe implements PipeTransform {
  constructor( ){}

  transform(value: unknown, item?: unknown[], btn?:any): any {

    // if user choose to show btn and permission is also true
    if (btn && btn.class && typeof (value) != 'function') {
      // console.log(currentPagePerm, 'fffffffffffffffffff')

      // verfiy if action btn includes ['add', 'view', 'edit', 'delete']
    return btn.class

    } else if (typeof value == 'function') { // value is not a boolean refrence
      return value(item);
    } else {
      return value
    }



  }


}
