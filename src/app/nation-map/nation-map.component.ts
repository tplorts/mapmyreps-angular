import { Component, Output, EventEmitter, OnInit } from '@angular/core';

import { Color, mix as chromaMix, ColorSpaces } from 'chroma-js';

import { UserOptionsService, PartyColoringMode } from '../core/user-options.service';
import { Logger } from '../core/logger.service';
import { UsaGeographyService, IStateFeature } from '../data/usa-geography.service';
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
export class NationMapComponent implements OnInit {

  // TODO: find a way to grab these color definitions from the
  // scss theme files
  private static readonly PartyColors = {
    Republican: '#BC2929',
    Democrat: '#5586EF',
    Independent: '#3BAC69',
  };

  private readonly WidthLimits = { min: 768, max: 1200 };
  private readonly MapSize = { width: 960, height: 600 };

  @Output() onSelectState = new EventEmitter<IStateFeature>();


  constructor(
    private geography: UsaGeographyService,
    private congress: CongressService,
    public options: UserOptionsService,
  ) { }

  ngOnInit() {
    this.options.partyColoringModeChange.subscribe(() => this.updateStateColors());
    this.options.colorMixModeChange.subscribe(() => this.updateStateColors());
    this.computeStateProportions();
  }

  public get stateFeatures(): Array<IStateFeature | any> {
    return this.geography.stateFeatures;
  }

  public get stateBordersPathData(): string {
    return this.geography.stateBordersPathData;
  }

  public selectState(state: IStateFeature) {
    this.onSelectState.emit(state);
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

  private computeStateProportions() {
    const parties = Object.values(PoliticalParty);
    for (const state of this.stateFeatures) {
      const reps = this.congress.repsForPostal(state.postal);
      if (!reps) {
        log.warn('got no reps for state', state);
      }
      state.repCount = reps.length;
      const seatProportionsByParty = {};
      for (const party of parties) {
        const seats = reps.filter(r => r.party === party);
        seatProportionsByParty[party] = seats.length / state.repCount;
      }
      state.seatProportionsByParty = seatProportionsByParty;
      const dem = state.seatProportionsByParty.Democrat;
      const rep = state.seatProportionsByParty.Republican;
      state.tooltipText = `${state.postal} ${Math.round(100 * dem)}-${Math.round(100 * rep)}`;
    }

    this.updateStateColors();
  }

  private computeStateColor(state: IStateFeature): Color {
    if (this.options.partyColoringMode === PartyColoringMode.Majority) {
      return this.majorityColor(state);
    } else if (this.options.partyColoringMode === PartyColoringMode.Proportion) {
      return this.proportionalColor(state);
    } else {
      return null;
    }
  }

  private proportionalColor(state: IStateFeature | any): Color {
    const p = state.seatProportionsByParty[PoliticalParty.Republican];
    const { Democrat, Republican } = NationMapComponent.PartyColors;
    return chromaMix(Democrat, Republican, p, <keyof ColorSpaces> this.options.colorMixMode);
  }

  private majorityColor(state: IStateFeature | any): Color {
    const parties = Object.values(PoliticalParty);
    let majorityParty;
    for (const party of parties) {
      const p = state.seatProportionsByParty[party];
      if (p === 0.5) {
        return this.proportionalColor(state);
      } else if (p > 0.5) {
        majorityParty = party;
      }
    }
    return NationMapComponent.PartyColors[majorityParty];
  }

  private updateStateColors() {
    for (const state of this.stateFeatures) {
      state.fillColor = this.computeStateColor(state);
    }
  }
}
