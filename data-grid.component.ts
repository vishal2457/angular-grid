import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DataGridService } from './data-grid.service';
import {
  actionButtonType,
  filterEmitterType,
  headerObject,
  permissionType,
} from './data-grid.type';
import { map, take } from 'rxjs';
import { ExcelService } from 'src/app/modules/excel/excel.service';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/services/core/global-constants';
import { LocalStorageService } from 'src/app/services/core/local-storage.service';

@Component({
  selector: 'dash-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashDataGridComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    public _ds: DataGridService,
    private es: ExcelService,
    private router: Router,
    private _cd: ChangeDetectorRef,
    private _ls: LocalStorageService
  ) { }

  @Input() data: Array<any> = []; // set database records
  @Input() headerInfo: Array<headerObject | any> = []; //th
  @Input() filterDropdownData: any = null;
  @Input() totalCount: number = null;
  @Input() loading: boolean = false;
  @Input() actionButtons: actionButtonType[];
  @Input() bulkActions: string[];
  @Input() checkbox: boolean;
  @Input() headerTitle: string;
  @Input() excelURL: string;
  @Input() handleExport: any;
  @Input() selected: number | string[];
  @Input() extraExportKeys: { key: string; title: string }[] = [];
  @Input() showAdd: boolean;
  @Input() id: string;
  @Input() skipPermission: boolean;



  @Output() handleChange = new EventEmitter<filterEmitterType>(null);
  @Output() actionButtonClick = new EventEmitter<any>(null);
  @Output() bulkActionClick = new EventEmitter<any>(null);
  @Output() addClick = new EventEmitter<any>(null);

  private subs = new SubSink();
  itemsPerPage = this._ds.getFilter$.pipe(map((data) => data.limit));
  currentPage = this._ds.getFilter$.pipe(map((data) => data.page));
  timeout = null;
  actualLoader: boolean = false;
  currentPagePerm: permissionType

  ngOnInit(): void {
    this.currentPagePerm = this.currentPagePermission();
    this.subs.sink = this._ds.getFilter$.subscribe((data) => {
      this.handleChange.emit(data);
    });
    this._ds.updateHeaders(this.headerInfo);

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['id']?.currentValue) {
      this._ds.registerInstance(changes['id']?.currentValue)
    }

    if (changes['loading']?.currentValue) {
      this.timeout = setTimeout(() => {
        this.actualLoader = true;
        this._cd.detectChanges();
      }, 1500);
    }

    if (!changes['loading']?.currentValue && this.timeout) {
      clearTimeout(this.timeout);
      this.actualLoader = false;
      this._cd.detectChanges();
    }
    if (changes['data']?.currentValue) {
      this._ds.updateData(this.data);
    }

    if (changes['filterDropdownData']?.currentValue) {
      this._ds.updateFilterItems(changes['filterDropdownData'].currentValue);
    }

    if (changes['actionButtons']?.currentValue) {
      this._ds.updateActionButtons(changes['actionButtons']?.currentValue);
    }

    if (
      changes['selected']?.currentValue &&
      changes['selected']?.currentValue?.length
    ) {
      this._ds.initialSelected(changes['selected'].currentValue);
    }


    // Pratik ==> changes headers dynamically in conclave component
    if (changes['headerInfo']?.currentValue) {
      this._ds.updateHeaders(changes['headerInfo'].currentValue)
    }
  }

  ngOnDestroy(): void {
    this._ds.resetSelection();
    this.subs.unsubscribe();
  }

  changePage(page: number) {
    console.log('outside', page);

    this._ds.handlePageChange(page);
    // this.updateData.emit(page)
    window.scroll(0, 0);
  }

  onDrag(e: any) {
    // moveItemInArray(this.headerInfo, e.previousIndex, e.currentIndex);
    // this.headerInfo = [...this.headerInfo];
  }

  exportExcel() {
    if (!this.excelURL) {
      return console.error('No excel url provided');
    }

    this.subs.sink = this._ds.getFilter$.pipe(take(1)).subscribe((f) => {
      this.subs.sink = this._ds
        .selectedEntriesData()
        .pipe(take(1))
        .subscribe((d) => {
          if (this.handleExport) {
            this.handleExport({
              url: this.excelURL,
              filename: 'excel-data',
              filters: { ...f, forExcel: true },
              headers: this.headerInfo,
              extraExportKeys: this.extraExportKeys,
              ...d,
            });
            return;
          }
          this.es.updateExportInfo({
            url: this.excelURL,
            filename: 'excel-data',
            filters: {
              ...f,
              forExcel: true,
              filters: f.filters ? JSON.stringify(f.filters) : false,
            },
            headers: this.headerInfo,
            extraExportKeys: this.extraExportKeys,
            ...d,
          });

          this.router.navigate(['/excel-export']);
        });
    });
  }


  // get current page permission
  currentPagePermission() {

    if(this.skipPermission) {
      return {add:true, edit: true, view:true, delete:true, disabled: true}
    }

    // get flat menu from ls
    let flatMenu: any[] = this._ls.get(GlobalConstants.lsKeys.flatMenu);


    // get current url from router
    let currentUrl = this.router.url;


    let perm: permissionType;
    // fetch perm
    for (let f of flatMenu) {

      if (f.link == currentUrl && f.permission) {
        perm = f.permission;
        break;
      }
    }

    return perm;


  }

}
