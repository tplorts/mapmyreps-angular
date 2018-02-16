import { Component, OnInit } from '@angular/core';
import {
  Color,
  hex as hexToColor,
  mix as chromaMix,
  ColorSpaces
} from 'chroma-js';

import { UserOptionsService, PartyColoringMode } from '@app/core/user-options.service';
import { Logger } from '@app/core/logger.service';
import { UsaGeographyService, IStateFeature } from '@usa-data/usa-geography.service';
import { CongressService } from '@usa-data/congress.service';
import {
  Legislator,
  Senator,
  Representative,
  PoliticalParty,
  AllPoliticalParties,
} from '@usa-data/congress';
import { PoliticalStatsService, RegionalPoliticalStats } from '@app/data/political-stats.service';

const log = new Logger('NationMap');



@Component({
  selector: 'app-nation-map',
  templateUrl: './nation-map.component.pug',
  styleUrls: ['./nation-map.component.scss']
})
export class NationMapComponent implements OnInit {

  // TODO: find a way to grab these color definitions from the
  // scss theme files
  private static readonly PartyColors: { [party: string]: Color } = {
    Republican: hexToColor('#BC2929'),
    Democrat: hexToColor('#5586EF'),
    Independent: hexToColor('#3BAC69'),
  };

  private readonly WidthLimits = { min: 768, max: 1200 };
  private readonly MapSize = { width: 960, height: 600 };

  private _stateFillColors: { [postal: string]: Color };


  constructor(
    private geography: UsaGeographyService,
    private congress: CongressService,
    private stats: PoliticalStatsService,
    public options: UserOptionsService,
  ) { }

  ngOnInit() {
    this.options.partyColoringModeChange.subscribe(() => this.updateStateColors());
    this.options.colorMixModeChange.subscribe(() => this.updateStateColors());
    this.stats.compute();
    this.updateStateColors();
  }

  public get stateFeatures(): IStateFeature[] {
    return this.geography.stateFeatures;
  }

  public get stateBordersPathData(): string {
    return this.geography.stateBordersPathData;
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

  private computeStateColor(stateStats: RegionalPoliticalStats): Color {
    if (this.options.partyColoringMode === PartyColoringMode.Majority) {
      return this.majorityColor(stateStats);
    } else if (this.options.partyColoringMode === PartyColoringMode.Proportion) {
      return this.proportionalColor(stateStats);
    } else {
      return null;
    }
  }

  private proportionalColor(stateStats: RegionalPoliticalStats): Color {
    const pRepub = stateStats.seatProportionsPerParty[PoliticalParty.Republican];
    const pInde = stateStats.seatProportionsPerParty[PoliticalParty.Independent];
    const { Democrat, Republican, Independent } = NationMapComponent.PartyColors;
    const mixMode = <keyof ColorSpaces> this.options.colorMixMode;
    const twoPartyMixture = chromaMix(Democrat, Republican, pRepub, mixMode);
    return chromaMix(twoPartyMixture, Independent, pInde);
  }

  private majorityColor(state: RegionalPoliticalStats): Color {
    const parties = AllPoliticalParties;
    let majorityParty;
    for (const party of parties) {
      const p = state.seatProportionsPerParty[party];
      if (p === 0.5) {
        return this.proportionalColor(state);
      } else if (p > 0.5) {
        majorityParty = party;
      }
    }
    return NationMapComponent.PartyColors[majorityParty];
  }

  private updateStateColors() {
    if (!this._stateFillColors) {
      this._stateFillColors = {};
    }
    for (const state of this.stateFeatures) {
      const color = this.computeStateColor(this.stats.ofState(state.postal));
      this._stateFillColors[state.postal] = color;
    }
  }

  public fillColor(state: IStateFeature): Color {
    return this._stateFillColors && this._stateFillColors[state.postal];
  }
}
