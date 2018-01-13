import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Logger } from '../core/logger.service';
import { UsaGeographyService } from '../data/usa-geography.service';
import { CongressService } from '../data/congress.service';
import {
  Legislator,
  Senator,
  Representative,
  PoliticalParty,
} from '../data/congress';



const log = new Logger('MapViewComponent');



@Component({
  selector: 'app-nation-map',
  templateUrl: './nation-map.component.pug',
  styleUrls: ['./nation-map.component.scss']
})
export class NationMapComponent {

  private readonly WidthLimits = { min: 768, max: 1200 };
  private readonly MapSize = { width: 960, height: 600 };

  public isPartyColoringOn: boolean;

  @Input()  selectedState: any;
  @Output() selectedStateChange = new EventEmitter<any>();


  constructor(
    private geography: UsaGeographyService,
    private congress: CongressService,
  ) {
    this.selectedState = null;
    this.isPartyColoringOn = true;
    this.congress.dataObservable.subscribe(null, null, () => {
      this.computeStateColors();
    });
  }

  public get stateFeatures(): any[] {
    return this.geography.stateFeatures;
  }

  public get stateBordersPathData(): string {
    return this.geography.stateBordersPathData;
  }

  public selectState(state: any) {
    this.selectedState = (!state || this.selectedState === state) ? null : state;
    this.selectedStateChange.emit(this.selectedState);
  }

  public isSelected(state: any): boolean {
    return state && state === this.selectedState;
  }

  public get width(): number {
    return this.viewWidth;
  }

  public get height(): number {
    return this.viewWidth * this.MapSize.height / this.MapSize.width;
  }

  public get nationTransform(): string {
    const scale = this.viewWidth / this.MapSize.width;
    return `scale(${scale})`;
  }

  public get viewWidth(): number {
    return Math.min(this.WidthLimits.max, Math.max(this.WidthLimits.min, window.innerWidth));
  }

  private computeStateColors() {
    const PartyColors = {
      Republican: '#BC2929',
      Democrat: '#5586EF',
      Independent: '#3BAC69',
    };
    const parties = Object.values(PoliticalParty);
    for (const state of this.stateFeatures) {
      const reps = this.congress.repsForState(state.abbreviation);
      const seatsByParty = {};
      let maxSeats = 0;
      let majorityParty = null;
      for (const party of parties) {
        const seats = seatsByParty[party] = reps.filter(r => r.party === party);
        if (seats.length > maxSeats) {
          maxSeats = seats.length;
          majorityParty = party;
        }
      }
      state.seatsByParty = seatsByParty;
      state.fillColor = PartyColors[majorityParty];
    }
  }
}
