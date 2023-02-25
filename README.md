
# Data grid

Angular data grid. (this is not a library you can simply copy paste and change it according to your needs)

## Source

You can access the source of datagrid from [here](https://pip.pypa.io/en/stable/).

## Usage

```
<dash-data-grid
    [headerInfo]="headers"
    [data]="source$ | async"
    [filterDropdownData]="filterDropdownData"
    (handleChange)="handleChange($event)"
    [totalCount]="totalCount"
    [loading]="loading"
    [actionButtons]="actionButtons"
  ></dash-data-grid>
```

## options

| Attribute             | required      | information                               | type |
| ----------------------|:-------------:| :-----                                    | :----------|
| [headerInfo]          | true          | defines column info.                      | headerObject[]
| [data]                | true          | data source to render.                    | any[] 
| [filterDropdownData]  | false         | data for any dropdown filters in grid filters maps to data key in filter object| {[key: string]: any[]}
| (handleChange)        | true          | any change made in the grid               | function
| [totalCount]          | false         | total data count                          | number
| [loading]             | false         | loading indicator                         | boolean
| [actionButtons]       | false         | action button array                       | actionButtonType[]
| [checkbox]            | true          | disable/enable checkbox in grid           | boolean
| [bulkAction]          | false         | bulkactions in grid                       | string[]
| (bulkActionClick)     | false         | handle bulkaction click                   | function

all types are importable from data grid types.

## Header example

```
readonly header: headerObject[] = [
    {
      title: 'Username',
      name: 'name',
      visible: true,
      isSortable: true,
      filter: {
        type: 'text',
        field: 'name',
        bindValue: 'name',
      },
    },
    {
      title: 'Status',
      name: 'isActive', //bind value from object
      isSortable: true,
      formatter: this.statusFormatter //should return string or number
      dataClass: this.deriveDataClass, //should return string
      headerClass: this.deriveHeaderClass, //should return string
      visible: this.show, //should return boolean
      filter: {
        type: 'select',
        bindValue: 'value',
        bindLabel: 'label',
        dataKey: 'status',
        placeholder: 'status',
      },
    },
  ];
  
  
   filterDropdownData = { status: [{
    value: 1,
    label: 'Active'
  },{
    value: 0,
    label: 'InActive'
  }] };

  
   statusFormatter(item) {
    if (item.isActive) {
      return 'Active';
    }
    return 'In Active';
  }
  
```

### Bulk actions
current grid state will be passed in the parameter of bulkactionclick.

```
let obj = { 
action: "Delete",
excluded: [], //when selectAll is true check this array
filters: {page: 1, limit: 10, firstChange: false, latestChange: 'page'}, //current filters
included: [647, 648], //when selectAll is false check this array
selectAll: false
}
```

## Contributing
Any changes or suggestions are welcome. Please discuss the changes before hand.

Please make sure to use types where applicable to avoid wring config.