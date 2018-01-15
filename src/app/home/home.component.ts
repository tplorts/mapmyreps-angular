import { Component, OnInit } from '@angular/core';

import { UsaGeographyService } from '../data/usa-geography.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.pug',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public selectedState: any;

  constructor(
    private geography: UsaGeographyService,
  ) {
  }

  ngOnInit() {
    this.selectedState = null;
  }

  public closeState(): void {
    this.selectedState = null;
  }

  public get states(): any[] {
    return this.geography.stateFeatures;
  }
}
