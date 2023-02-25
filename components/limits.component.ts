import { ChangeDetectionStrategy, Component } from '@angular/core';
import { availableLimits } from '../constants';
import { DataGridService } from '../data-grid.service';

@Component({
  selector: 'grid-limits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>
    <button
      class="btn btn-sm"
      [ngClass]="{ active: (ds.getFilter$ | async)?.limit == limit }"
      *ngFor="let limit of limits"
      (click)="ds.handleLimitChange(limit)"
    >
      {{ limit }}
    </button>
  </div>`,
})
export class LimitsComponent {
  constructor(public ds: DataGridService) {}
  limits = availableLimits;
}
