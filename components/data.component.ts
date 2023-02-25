import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DataGridService } from '../data-grid.service';
import { actionClickData, permissionType } from '../data-grid.type';
@Component({
  selector: '[grid-data]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <ng-container *ngFor="let d of ds.data$ | async; let index = index">
  <tr [ngClass]="{'selected':ds.dataChecked(d.id) | async}">
    <td *ngIf="checkbox" (click)="ds.handleDataCheck(d.id)" class="pointer tblCheckbox">
      <input
        type="checkbox"
        [checked]="ds.dataChecked(d.id) | async"
      />
    </td>
    <ng-container *ngFor="let h of ds.headers$ | async; let head_index = index">
      <td [class]="h.dataClass | render: d" *ngIf="h.visible">
        <span title="{{ h.formatter ? h.formatter(d, h) : d[h.name] }}">
          {{ h.formatter ? h.formatter(d, h) : d[h.name] }}
        </span>
      </td>
    </ng-container>
    <ng-container *ngIf="ds.hasActions()">
      <td
      grid-action
      [data]="d"
      (actionButtonClick)="actionButtonClick.emit($event)"
      [currentPagePerm] = "currentPagePerm"
      class="text-center actionCol">
      </td>
    </ng-container>
  </tr>
  </ng-container>
 `,
  styleUrls: ['../data-grid.component.scss'],
})
export class GridDataComponent {
  constructor(public ds: DataGridService) {}
  @Input() checkbox: boolean;
  @Output() actionButtonClick = new EventEmitter<actionClickData>();
  @Input() currentPagePerm: permissionType;
}
