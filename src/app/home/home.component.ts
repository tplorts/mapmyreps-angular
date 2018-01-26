import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UsaGeographyService, IStateFeature } from '../data/usa-geography.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.pug',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private _selectedState: IStateFeature;

  constructor(
    private router: Router,
    private geography: UsaGeographyService,
  ) {
  }

  ngOnInit() {
    this._selectedState = null;
  }

  // public closeState(): void {
  //   this.selectedState = null;
  // }

  public get states(): IStateFeature[] {
    return this.geography.stateFeatures;
  }

  public get selectedState(): IStateFeature {
    return this._selectedState;
  }

  public set selectedState(state: IStateFeature) {
    this._selectedState = state;
    this.router.navigate([state.postal]);
  }
}
