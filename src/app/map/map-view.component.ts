import { Component } from '@angular/core';

import { Logger } from '../core/logger.service';
import { UsaGeographyService } from '../data/usa-geography.service';
import { Legislator, Senator, Representative } from '../data/congress';



const log = new Logger('MapViewComponent');





@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent {

  private _options: { width: number, height: number } = { width: 960, height: 600 };

  public selectedState: any;


  constructor(
    private geography: UsaGeographyService,
  ) {
    this.selectedState = null;
  }

  public get stateFeatures(): any[] {
    return this.geography.stateFeatures;
  }

  public get stateBordersPathData(): string {
    return this.geography.stateBordersPathData;
  }

  public selectState(state: any) {
    this.selectedState = (!state || this.selectedState === state) ? null : state;
  }

  public isSelected(state: any): boolean {
    return state && state === this.selectedState;
  }

  public get width(): number {
    return this._options.width;
  }

  public get height(): number {
    return this._options.height;
  }

}
