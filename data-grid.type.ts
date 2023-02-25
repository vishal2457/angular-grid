export interface filterConfig {
  type: 'date' | 'dateRange' | 'select' | 'text' | 'number' | 'checkbox';
  placeholder?: string | undefined;
  bindValue?: string;
  bindLabel?: string;
  isMultiple?: boolean;
  dataKey?: string;
  field?: string;
}
export interface headerObject {
  title: string;
  type?: 'email' | 'button' | 'image' | 'text';
  field?: string;
  name: string;
  isSortable?: boolean | undefined;
  visible: boolean | number;
  allowToExport?: boolean;
  dataClass?: ((item: any, header?: any) => any) | string;
  headerClass?: ((item: any, header?: any) => any) | string;
  formatter?: (data: any, header?: any) => {};
  filter?: filterConfig;
}

export interface filterEmitterType {
  filters?: any;
  limit: number;
  sort?: { [key: string]: 'ASC' | 'DESC' | undefined };
  page: number;
  firstChange: boolean;
  latestChange?: 'sort' | 'filters' | 'limit' | 'page';
}

export interface actionButtonType {
  btnClass?:string;
  btnLabel?:string;
  button?: boolean;
  tooltip: string;
  class: ((item: any) => string) | string;
  show: ((item: any) => boolean) | boolean;
}

export interface actionClickData {
  action: string;
  data: any;
}
export interface checkboxClickData {
  data?: any;
  action?: string;
}

export enum GRID_OPTIONS {
  SORT = 'SORT',
  HIDE_FILTER = 'HIDE_FILTER',
  HIDE_COLUMN = 'HIDE_COLUMN',
}

export enum OPTION_TITLES {
  SELECT_COLUMNS = 'Select Columns',
  ACTIONS = 'Actions',
  EXPORT = 'Export',
  STYLE = 'Style'
}


export interface permissionType {
  add: boolean,
  edit: boolean,
  view: boolean,
  delete: boolean,
  disabled:boolean

}
