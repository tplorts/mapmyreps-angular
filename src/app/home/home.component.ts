import { Component, HostBinding } from '@angular/core';

import { UsaGeographyService, IStateFeature } from '../data/usa-geography.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.pug',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private _mapViewOverride: boolean;

  constructor(private geography: UsaGeographyService) {
    this._mapViewOverride = false;
  }

  public get states(): IStateFeature[] {
    return this.geography.stateFeatures;
  }

  @HostBinding('class.map-view-override')
  public get mapViewOverride(): boolean {
    return this._mapViewOverride;
  }

  public useMapView() {
    this._mapViewOverride = true;
  }
}
