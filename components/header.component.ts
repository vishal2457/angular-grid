import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { DataGridService } from '../data-grid.service';
import { GRID_OPTIONS, headerObject } from '../data-grid.type';

@Component({
  selector: `[grid-header]`,
  template: `
    <tr class="example-list">
      <th *ngIf="checkbox" class="tblCheckbox">
        <input
          class="head-checkbox"
          type="checkbox"
          [checked]="
            (ds.allSelected$ | async) && !(ds.excludedEntries$ | async).length
          "
          (change)="ds.toggleSelectAll($event)"
        />
      </th>
      <ng-container
        *ngFor="let header of ds.headers$ | async; let head_index = index"
      >
        <th *ngIf="header.visible" [class]="header.headerClass | render">
          <span class="d-flex justify-content-between align-items-center">
            <span>{{ header.title }}</span>
            <dash-menu
              [options]="options"
              bindLabel="name"
              (handleChange)="handleChange($event, header)"
            >
              <i class="fa-solid fa-ellipsis-vertical pointer"></i>
            </dash-menu>
          </span>
        </th>
      </ng-container>
      <th class="actionCol text-center" *ngIf="ds.hasActions()">
        <span>Actions</span>
      </th>
    </tr>
    <tr class="filteropen" *ngIf="ds.showfilter$ | async">
      <th></th>
      <ng-container
        *ngFor="let header of ds.headers$ | async; let head_index = index"
      >
        <th *ngIf="header.visible && !header.filter"></th>
        <th
        grid-filter
          *ngIf="header.visible && header.filter"
          [config]="header.filter"
          [headerKey]="header.name"
        ></th>
      </ng-container>
      <th *ngIf="ds.hasActions()"></th>
    </tr>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../data-grid.component.scss'],
})
export class GridHeaderComponent {
  constructor(public ds: DataGridService) {}
  @Output() onDrag = new EventEmitter<CdkDragDrop<string[]>>();
  @Input() checkbox: boolean;

  options = [
    { name: 'sort ASC', type: GRID_OPTIONS.SORT, value: 'ASC' },
    { name: 'sort DESC', type: GRID_OPTIONS.SORT, value: 'DESC' },
  ];

  drop(event: CdkDragDrop<string[]>) {
    this.onDrag.emit(event);
  }

  handleChange(e, header: headerObject) {
    this.ds.handleHeaderOptions(e, header);
  }
}
