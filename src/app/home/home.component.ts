import { Component } from '@angular/core';

import { UsaGeographyService, IStateFeature } from '../data/usa-geography.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.pug',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private geography: UsaGeographyService) {}

  public get states(): IStateFeature[] {
    return this.geography.stateFeatures;
  }
}
