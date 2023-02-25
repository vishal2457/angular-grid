import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {  Router } from '@angular/router';
import { DataGridService } from '../data-grid.service';
import { OPTION_TITLES } from '../data-grid.type';
import { permissionType } from '../data-grid.type';

@Component({
  selector: 'column-options',
  template: ` <div [class]="toggleClass">
    <div class="show_header_selection_box">
      <div
        class="filter-header-column d-flex justify-content-between align-items-center"
      >
        <div class="p-3">
          <div class="d-flex justify-content-between">
            <p class="m-0">{{ active }}</p>
          </div>
        </div>
        <button class="btn pe-3" (click)="close($event)">
          <i class="fa fa-times pointer"></i>
        </button>
      </div>

      <ng-container *ngIf="active == 'Select Columns' || active == 'Export'">
        <div
          class="custom-control custom-checkbox"
          *ngFor="let h of dgs.headers$ | async; let index = index"
        >
          <span>
            <input
              type="checkbox"
              class="custom-control-input"
              (change)="dgs.toggleVisibility(index)"
              [checked]="h.visible"
              [id]="h.title"
            />
            <label class="custom-control-label" [for]="h.title">{{
              h.title
            }}</label>
          </span>
        </div>
      </ng-container>

      <ng-container *ngIf="active == 'Actions'">
        <div class="actionContent my-3" >
          <button
            class="btn btn-primary btn-block"
            *ngFor="let action of bulkActions"
            (click)="handleActionClick(action)"
          >
            {{ action }}
          </button>
        </div>
      </ng-container>

      <ng-container *ngIf="active == 'Style'">
        <div>
          <label>Density</label>
          <select (change)="dgs.updateDensity($event)" [value]="dgs.density$ | async" >
            <option value="conjusted" >Conjusted</option>
            <option value="normal">Normal</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </div>
      </ng-container>
    </div>

    <div class="grid_options_strip">
      <!-- <div (click)="toggleSwitcher($event, titles.EXPORT)">
        <span [ngClass]="{ active: active == titles.EXPORT }">Export</span>
      </div> -->
      <!-- <div (click)="toggleSwitcher($event, titles.STYLE)">
        <span [ngClass]="{ active: active == titles.STYLE }">
          Style
        </span>
      </div> -->
      <div *ngIf="!skipPermission ? currentPagePerm['multiAction'] : skipPermission" (click)="toggleSwitcher($event, titles.ACTIONS)">
        <span [ngClass]="{ active: active == titles.ACTIONS }"> Actions </span>
      </div>
      <div (click)="toggleSwitcher($event, titles.SELECT_COLUMNS)">
        <span [ngClass]="{ active: active == titles.SELECT_COLUMNS }">
          Columns
        </span>
      </div>
    </div>
  </div>`,
  styleUrls: ['../data-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnOptionsComponent {

  isForm: boolean = false;

  constructor(public dgs: DataGridService, private router:Router) {
    //grid included inside a form ==> for every form as discussed with gautam ==> Date: 10/11/22 7:10PM - 7:25PM
    // this.isForm = this.router.url.toLowerCase().includes('form');
  }
  @Input() bulkActions: string[];
  @Output() bulkActionClick = new EventEmitter();
  @Input() currentPagePerm: permissionType
  @Input() skipPermission: boolean

  isOpenSwitcher = false;
  toggleClass = 'show_header_selection';
  selectAll: boolean = true;
  readonly titles = OPTION_TITLES;
  active: string = null;

  close(event) {
    console.log(this.currentPagePerm)
    this.active = null;
    this.isOpenSwitcher = false;
    this.toggleClass = 'show_header_selection hidden';
    event.stopPropagation();
  }

  handleActionClick(action: string) {
    this.bulkActionClick.emit({ action, ...this.dgs.getCurrentState() });
  }

  //column selector hide and show
  toggleSwitcher(event: any, type?: any): void {
    if (this.active != type && this.isOpenSwitcher) {
      this.active = type;
      return;
    }
    this.active = type;

    this.isOpenSwitcher = !this.isOpenSwitcher;
    this.toggleClass = this.isOpenSwitcher
      ? 'show_header_selection shown'
      : 'show_header_selection hidden';
    event.stopPropagation();
  }
}
