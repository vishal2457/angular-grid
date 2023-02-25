import { ChangeDetectionStrategy, Component } from "@angular/core";


@Component({
  selector: 'grid-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="gridLoader">
    <div class="loaderIcon">
      <div class="loaderIconBox one"></div>
      <div class="loaderIconBox two"></div>
      <div class="loaderIconBox three"></div>
      <div class="loaderIconBox four"></div>
      <div class="loaderIconBoxCenter"></div>
    </div>
    <div class="loaderText">Loading...</div>
  </div>`
})

export class GridLoader {

}
