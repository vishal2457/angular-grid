import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DashDataGridComponent } from './data-grid.component';
import { LimitsComponent } from './components/limits.component';
import { GridHeaderComponent } from './components/header.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GridDataComponent } from './components/data.component';
import { GridFilterComponent } from './components/filter.component';
import { DashMenuModule } from '../menu/menu.module';
import { GetItemsPipe } from './pipes/dropdown-items.pipe';
import { NgbPagination } from './components/pagination.component';
import { RenderPipe } from './pipes/renderer.pipe';
import { classRenderPipe } from './pipes/classRender.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ColumnOptionsComponent } from './components/column-options.component';
import { GridLoader } from './components/loader.component';
import { RenderTitlePipe } from './pipes/render-title.pipe';
import { ActionButtonComponent } from './components/action.component';
import { GridToolbarComponent } from './components/toolbar.component';
import { DataGridService } from './data-grid.service';
import { IfDataComponent } from './components/if-data.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    DragDropModule,
    DashMenuModule,
    BsDatepickerModule.forRoot(),

  ],
  providers: [DataGridService],
  declarations: [
    GridLoader,
    ColumnOptionsComponent,
    DashDataGridComponent,
    LimitsComponent,
    GridHeaderComponent,
    GridDataComponent,
    GridFilterComponent,
    GridFilterComponent,
    NgbPagination,
    GetItemsPipe,
    RenderPipe,
    RenderTitlePipe,
    classRenderPipe,
    ActionButtonComponent,
    GridToolbarComponent,
    IfDataComponent
  ],
  exports: [DashDataGridComponent],
})
export class DashDataGridModule {}
