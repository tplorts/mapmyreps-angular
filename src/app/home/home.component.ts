import { Component, HostBinding } from '@angular/core';
import { UserOptionsService } from '@app/core/user-options.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.pug',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(
    public options: UserOptionsService,
  ) {
  }

  @HostBinding('class.map-view-override')
  public get mapViewOverride(): boolean {
    return this.options.alwaysShowMap;
  }

  public useMapView() {
    this.options.alwaysShowMap = true;
  }
}
