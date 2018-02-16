import { Component, HostBinding } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.pug',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private _mapViewOverride: boolean;

  constructor() {
    this._mapViewOverride = false;
  }

  @HostBinding('class.map-view-override')
  public get mapViewOverride(): boolean {
    return this._mapViewOverride;
  }

  public useMapView() {
    this._mapViewOverride = true;
  }
}
