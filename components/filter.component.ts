import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { DataGridService } from '../data-grid.service';
import { filterConfig } from '../data-grid.type';

@Component({
  selector: '[grid-filter]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      *ngIf="renderInput"
      [type]="config.type"
      class="form-control form-control-sm"
      [placeholder]="placeholder"
      [(ngModel)]="filterValue"
      (keyup)="handleFilterChange()"
    />
    <input
      *ngIf="renderDate"
      type="date"
      class="form-control form-control-sm"
      [placeholder]="placeholder"
      [(ngModel)]="filterValue"
      (change)="handleFilterChange()"
    />

    <input type="text"
     *ngIf="renderDateRange"
     id="date"
     [(ngModel)]="filterValue"
     bsDaterangepicker [bsConfig]="dpConfig" class="form-control"
     placeholder="DD-MM-YYYY" (ngModelChange)="handleDateFilter($event)"
     #datepicker="bsDaterangepicker" autocomplete="off" >

    <ng-select appendTo="body"
      *ngIf="renderSelect"
      [ngClass]="'ng-select'"
      [items]="config.dataKey | getItems"
      [multiple]="config.isMultiple"
      [bindLabel]="config.bindLabel"
      [bindValue]="config.bindValue"

      [placeholder]="placeholder"
      [(ngModel)]="filterValue"
      (change)="handleFilterChange()"
    >
    </ng-select>
  `,
})
export class GridFilterComponent implements OnInit, OnDestroy {
  constructor(private _ds: DataGridService, private _cdr: ChangeDetectorRef) { }

  @Input() config: filterConfig = null;
  @Input() headerKey: string = '';
  public dpConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-blue',
    rangeInputFormat: 'DD-MM-YYYY',
    showWeekNumbers: false,
  };
  get placeholder() {
    return this.config.placeholder || '';
  }
  get renderInput() {
    let { type } = this.config;
    return type == 'text' || type == 'number';
  }
  get renderSelect() {
    return this.config.type == 'select';
  }
  get renderDate() {
    return this.config.type == 'date';
  }
  get renderDateRange() {
    return this.config.type == 'dateRange';
  }

  filterValue: any = null;
  filterSubscription: Subscription;
  ngOnInit(): void {
    this.filterSubscription = this._ds.getFilter$.subscribe(res => {

      if (!res.filters) {
        this.filterValue = null;
        this._cdr.detectChanges()
      } else {
        if (res.filters[this.config.field]?.type == "dateRange") {
          this.filterValue = [new Date(res.filters[this.config.field]?.value[0]), new Date(res.filters[this.config.field]?.value[1])]
        } else {
          this.filterValue = res.filters[this.config.field]

        }
      }
    })
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  handleDateFilter(event) {
    let key = this.config.field || this.headerKey;

    if(event){
      this.filterValue = event
      this._ds.handleFilterChange({
        [key]: {
          type: 'dateRange',
          value: this.filterValue,
        },
      });
    }else{
      this.filterValue = null
      this._ds.handleFilterChange({ [key]: this.filterValue });


    }

  }

  handleFilterChange() {
    let key = this.config.field || this.headerKey;
    this._ds.handleFilterChange({ [key]: this.filterValue });
  }
}
