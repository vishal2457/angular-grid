import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DataGridService } from '../data-grid.service';
import { permissionType } from '../data-grid.type';

@Component({
  selector: 'grid-toolbar',
  template: `<div
    class="d-md-flex gap-2 p-2 justify-content-between bg-light border border-dark"
  >

    <h2 class="m-0">{{ headerTitle }}
</h2>
    <div class="gap-2 d-flex">
      <!-- <if-data> -->

        <!-- <div >
          <input type="text" id="date" bsDaterangepicker [bsConfig]="dpConfig" class="form-control"
              placeholder="DD-MM-YYYY"
          #datepicker="bsDaterangepicker">
      </div> -->
      <button
          class="btn btn-sm btn-primary"
          (click)="excelClick.emit($event)"
        >
          Export
      </button>


      <!-- </if-data> -->
      <if-data>

      <button
        class="btn btn-sm btn-primary"
        (click)="ds.toggleFilterVisibility()"
      >
        {{ (ds.showfilter$ | async) ? 'Hide' : 'Show' }} Filter
      </button>
      </if-data>
      <if-data>
      <button class="btn btn-sm btn-primary" (click)="ds.resetSelection()">
        Clear Selection
      </button>
      </if-data>

      <button class="btn btn-sm btn-primary" (click)="ds.clearFilter()">
        Clear filter
      </button>

      <button
        class="btn btn-sm btn-success"
        (click)="addClick.emit($event)"
        *ngIf="showAdd ? currentPagePerm['add'] : showAdd"
      >
        Add New
      </button>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridToolbarComponent {
  constructor(public ds: DataGridService) { }
  @Input() headerTitle: string;
  @Input() showExport: boolean;
  @Input() showAdd: boolean;
  @Input() currentPagePerm: permissionType;

  @Output() addClick = new EventEmitter();

  @Output() excelClick = new EventEmitter();
  public dpConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-blue',
    dateInputFormat: 'DD-MM-YYYY',
    showWeekNumbers: false,
  };
}
