import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, of, shareReplay } from 'rxjs';
import { GlobalConstants } from 'src/app/services/core/global-constants';
import { LocalStorageService } from 'src/app/services/core/local-storage.service';
import { SanitizationService } from 'src/app/services/core/sanitization.service';
import { DashDataGridModule } from './data-grid.module';
import {
  actionButtonType,
  filterEmitterType,
  GRID_OPTIONS,
  headerObject,
} from './data-grid.type';
import { toggleInArray } from './utils';

type DensityType = 'conjusted' | 'normal' | 'comfortable';

const initFilterValues = {
  page: 1,
  limit: GlobalConstants.DefaultItemsPerPage,
  firstChange: true,
};

@Injectable({
  providedIn: 'root',
})
export class DataGridService {
  private _filterEmitter = new BehaviorSubject<filterEmitterType>({
    ...initFilterValues,
  });
  private _headers = new BehaviorSubject<headerObject[]>([]);
  private _data = new BehaviorSubject<any[]>([]);
  private _filterDropdownData = new BehaviorSubject<any>(null);
  private _actionbuttons = new BehaviorSubject<actionButtonType[]>(null);
  private _allSelected = new BehaviorSubject<boolean>(false);
  private _excludedEntries = new BehaviorSubject<number[]>([]);
  private _includedEntries = new BehaviorSubject<number[]>([]);
  private _showFilters = new BehaviorSubject<boolean>(false);
  private _density = new BehaviorSubject<DensityType>('normal');
  private _gridID = new BehaviorSubject<string>('');
  private _defaultSelectState = new BehaviorSubject<{
    allSelect: boolean,
    includedEntries: number[],
    excludedEntries: number[]
  }>({
    allSelect: false,
    includedEntries: [],
    excludedEntries: []
  })

  getFilter$ = this._filterEmitter.asObservable();
  headers$ = this._headers.asObservable();
  data$ = this._data.asObservable();
  actionButtons$ = this._actionbuttons.asObservable();
  allSelected$ = this._allSelected.asObservable();
  excludedEntries$ = this._excludedEntries.asObservable();
  includeEntries$ = this._includedEntries.asObservable();
  showfilter$ = this._showFilters.asObservable();
  density$ = this._density.asObservable();

  private readonly GRID_LS_KEY = 'persist_data_isccm';

  constructor(
    private _sanitize: SanitizationService,
    private ls: LocalStorageService
  ) {}

  registerInstance(id: string) {
    let persistedData = this.ls.get(this.GRID_LS_KEY);
    this._gridID.next(id);

    if (!persistedData) {
      return;
    }

    let singleGridFilter: filterEmitterType = persistedData[id];
    if (!singleGridFilter) {
      this.ls.remove(this.GRID_LS_KEY);
      return;
    }

    this._filterEmitter.next(singleGridFilter);
    if (singleGridFilter.filters) {
      this._showFilters.next(true);
    }
  }

  private _updateExcluded(id: number) {
    let arr = toggleInArray(this._excludedEntries.value, id);
    this._excludedEntries.next([...arr]);
  }

  private _updateIncluded(id: number) {
    let arr = toggleInArray(this._includedEntries.value, id);
    this._includedEntries.next([...arr]);
  }

  initialSelected(arr) {
    const defaultValue = {...this._defaultSelectState.value}
    this._defaultSelectState.next({...defaultValue, includedEntries: arr})
    this._includedEntries.next(arr);
  }

  private _updateEmitterValues(
    key: 'sort' | 'filters' | 'limit' | 'page',
    value: any
  ) {
    let filterObj = {
      ...this._filterEmitter.value,
      [key]: value,
      latestChange: key,
      firstChange: false,
    };
    //setting filters to localstorage to persist
    if (this._gridID.value) {
      this.ls.set(this.GRID_LS_KEY, { [this._gridID.value]: filterObj });
    }
    this._filterEmitter.next(filterObj);
  }

  updateDensity(event: any) {
    this._density.next(event.target.value);
  }

  resetSelection() {
    const {excludedEntries, includedEntries, allSelect} = this._defaultSelectState.value;
    this._excludedEntries.next(excludedEntries);
    this._includedEntries.next(includedEntries);
    this._allSelected.next(allSelect);
    this._filterEmitter.next({ ...initFilterValues });
    // this._filterEmitter.complete();
  }

  clearFilter() {
    this._updateEmitterValues('filters', false);
    this._showFilters.next(false);
  }

  getCurrentState() {
    return {
      filters: this._filterEmitter.value,
      excluded: this._excludedEntries.value,
      included: this._includedEntries.value,
      selectAll: this._allSelected.value,
    };
  }

  //determine if single data is selected
  dataChecked(id: number) {
    return combineLatest([
      this.allSelected$,
      this.excludedEntries$,
      this.includeEntries$,
    ]).pipe(
      map(([allSelection, ex, inc]) => {
        if (allSelection && !ex.includes(id)) {
          return true;
        }
        if (!allSelection && inc.includes(id)) {
          return true;
        }
        return false;
      }),
      shareReplay(1)
    );
  }

  toggleFilterVisibility() {
    this._showFilters.next(!this._showFilters.value);
  }

  toggleSelectAll(event) {
    this._excludedEntries.next([]);
    this._includedEntries.next([]);
    this._allSelected.next(event.target.checked);
  }

  isExcluded = (id: number, returnType: 'boolean' | 'index' = 'boolean') => {
    let arr = this._excludedEntries.value;
    if (returnType == 'boolean') {
      return arr.includes(id);
    }
    return arr.findIndex((x) => x == id);
  };

  isIncluded = (id: number, returnType: 'boolean' | 'index' = 'boolean') => {
    let arr = this._includedEntries.value;
    if (returnType == 'boolean') {
      return arr.includes(id);
    }
    return arr.findIndex((x) => x == id);
  };

  selectedCount(totalCount: number) {
    return combineLatest([
      this.allSelected$,
      this.excludedEntries$,
      this.includeEntries$,
    ]).pipe(
      map(([allSelected, excluded, included]) => {
        if (allSelected) {
          return totalCount - excluded.length;
        }
        return included.length;
      })
    );
  }

  selectedEntriesData() {
    return combineLatest([
      this.allSelected$,
      this.excludedEntries$,
      this.includeEntries$,
    ]).pipe(
      map(([allSelected, excluded, included]) => {
        return { allSelected, excluded, included };
      })
    );
  }

  handleDataCheck(id: number) {
    if (this._allSelected.value) {
      this._updateExcluded(id);
      return;
    }
    this._updateIncluded(id);
  }

  hasActions() {
    if (!this._actionbuttons.value) {
      return false;
    }
    return this._actionbuttons.value?.length;
  }

  updateActionButtons(actions: actionButtonType[]) {
    this._actionbuttons.next(actions);
  }

  toggleVisibility(index: number) {
    let headers = this._headers.value;
    headers[index].visible = !headers[index].visible;
    this.updateHeaders(headers);
  }

  getFilterItems(key: string) {
    if (!this._filterDropdownData.value) {
      return [];
    }
    return this._filterDropdownData.value[key];
  }

  updateFilterItems(items: any[] | undefined) {
    if (!items) return;
    this._filterDropdownData.next(items);
  }

  updateHeaders(headers: headerObject[]) {
    this._headers.next(headers);
  }

  updateData(data: any[]) {
    this._data.next(data);
  }

  handleDragAndDrop(e: CdkDragDrop<string[]>) {
    let h = this._headers.value;
    //write logic for moving arrays
  }

  //handle sort change;
  handleSortChange(sortOptions: { [key: string]: 'ASC' | 'DESC' | undefined }) {
    this._updateEmitterValues('sort', sortOptions);
  }

  handleFilterChange(filter: { [key: string]: any }) {
    let val = {};
    if (this._filterEmitter.value?.filters) {
      val = this._filterEmitter.value.filters;
    }

    let sanitizedFilter = this._sanitize.sanitizeFilterObject({
      ...val,
      ...filter,
    });
    if (sanitizedFilter) {
      sanitizedFilter = JSON.parse(sanitizedFilter);
    } else {
      this.resetSelection();
    }

    this._updateEmitterValues('filters', sanitizedFilter);
  }

  handlePageChange(page: number) {
    this._updateEmitterValues('page', page);
  }

  handleLimitChange(limit: number) {
    this._updateEmitterValues('limit', limit);
  }

  handleHeaderOptions(
    obj: { name: string; type: string; value: any },
    header: headerObject
  ) {
    let { name, type, value } = obj;
    if (type == GRID_OPTIONS.SORT) {
      this.handleSortChange({ [header.name]: value });
    } else if (type == GRID_OPTIONS.HIDE_COLUMN) {
    }
  }
}
