import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UsaGeographyService, IStateFeature } from '../data/usa-geography.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.pug',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // private _selectedState: IStateFeature;

  constructor(
    private router: Router,
    private geography: UsaGeographyService,
  ) {
  }

  ngOnInit() {
  }

  public get states(): IStateFeature[] {
    return this.geography.stateFeatures;
  }

  public selectState(state: IStateFeature) {
    this.router.navigate([state.postal]);
  }
}
