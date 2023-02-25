import { Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/services/core/global-constants';
import { LocalStorageService } from 'src/app/services/core/local-storage.service';
import { DataGridService } from '../data-grid.service';
import { permissionType } from '../data-grid.type';

@Pipe({
  name: 'render',
})
export class RenderPipe implements PipeTransform {
  constructor( ){}

  transform(value: unknown, item?: unknown[], btn?:any, currentPagePerm?:permissionType): any {
    let keys:any
    if(currentPagePerm){
      keys = Object.keys(currentPagePerm);
    }
    // if user choose to show btn and permission is also true
    if (btn && btn.show && typeof (value) != 'function') {
      // console.log(currentPagePerm, 'fffffffffffffffffff')

      // verfiy if action btn includes ['add', 'view', 'edit', 'delete']
      if(keys.includes(btn.tooltip.toLowerCase())){

        return currentPagePerm[btn.tooltip.toLowerCase()];
      }else{
        return true
      }

    } else if (typeof value == 'function') { // value is not a boolean refrence
      return value(item);
    } else {
      return value
    }



  }


}
