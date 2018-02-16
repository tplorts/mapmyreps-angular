import { Component, OnInit } from '@angular/core';
import { UsaGeographyService, IStateFeature } from '../data/usa-geography.service';



@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.pug',
  styleUrls: ['./state-list.component.scss']
})
export class StateListComponent implements OnInit {
  private _stateSearchPattern: string;
  private matchingStates: IStateFeature[];

  constructor(
    private geography: UsaGeographyService,
  ) { }

  ngOnInit() {
    this.matchingStates = this.allStates;
  }

  public get allStates(): IStateFeature[] {
    return this.geography.stateFeatures;
  }

  public get states(): IStateFeature[] {
    return this.matchingStates;
  }

  public get stateSearchPattern(): string {
    return this._stateSearchPattern;
  }

  public set stateSearchPattern(p: string) {
    this._stateSearchPattern = p;
    if (this.stateSearchPattern) {
      const regex = new RegExp(this.stateSearchPattern, 'i');
      this.matchingStates = this.allStates.filter(s => regex.test(s.name) || regex.test(s.postal));
    } else {
      this.matchingStates = this.allStates;
    }
  }
}
