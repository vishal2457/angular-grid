import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataGridService } from '../data-grid.service';

@Component({
  selector: 'if-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container *ngIf="(ds.data$ | async).length">
    <ng-content></ng-content>
  </ng-container>`,
})
export class IfDataComponent {
  constructor(public ds: DataGridService) {}
}
