import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Color, mix as chromaMix, ColorSpaces } from 'chroma-js';

import { Logger } from '../core/logger.service';
import { UsaGeographyService } from '../data/usa-geography.service';
import { CongressService } from '../data/congress.service';
import {
  Legislator,
  Senator,
  Representative,
  PoliticalParty,
} from '../data/congress';

// type ChromaMixMode = keyof ColorSpaces;
type ChromaMixMode = string;
enum ColoringMode {
  Majority = 'Majority',
  Proportional = 'Proportional',
}


const log = new Logger('MapViewComponent');



@Component({
  selector: 'app-nation-map',
  templateUrl: './nation-map.component.pug',
  styleUrls: ['./nation-map.component.scss']
})
export class NationMapComponent {

  // TODO: find a way to grab these color definitions from the
  // scss theme files
  private static readonly PartyColors = {
    Republican: '#BC2929',
    Democrat: '#5586EF',
    Independent: '#3BAC69',
  };

  private static readonly AllChromaMixModes: ChromaMixMode[] = [
    'rgb', 'hsl', 'lab', 'lch', 'lrgb',
  ];

  private static readonly _AllColoringModes: string[] = Object.values(ColoringMode);

  private readonly WidthLimits = { min: 768, max: 1200 };
  private readonly MapSize = { width: 960, height: 600 };

  public isPartyColoringOn: boolean;
  private _chromaMixMode: ChromaMixMode;
  private _coloringMode: ColoringMode;

  private _isLoading: boolean;

  @Input()  selectedState: any;
  @Output() selectedStateChange = new EventEmitter<any>();


  constructor(
    private geography: UsaGeographyService,
    private congress: CongressService,
  ) {
    this._isLoading = true;
    this.selectedState = null;
    this.isPartyColoringOn = true;
    this._chromaMixMode = 'lab';
    this._coloringMode = ColoringMode.Proportional;
    Observable.forkJoin(
      this.congress.dataObservable,
      this.geography.dataObservable,
    )
    .subscribe(() => {
      this.computeStateProportions();
      this._isLoading = false;
    });
  }

  public get isLoading(): boolean {
    return this._isLoading;
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

  public get allChromaMixModes(): string[] {
    return NationMapComponent.AllChromaMixModes;
  }

  public get chromaMixMode(): ChromaMixMode {
    return this._chromaMixMode;
  }

  public set chromaMixMode(m: ChromaMixMode) {
    log.debug(m);
    this._chromaMixMode = m;
    this.updateStateColors();
  }

  public get AllColoringModes(): string[] {
    return NationMapComponent._AllColoringModes;
  }

  public get coloringMode(): ColoringMode {
    return this._coloringMode;
  }

  public set coloringMode(v: ColoringMode) {
    this._coloringMode = v;
    this.updateStateColors();
  }

  private computeStateProportions() {
    const parties = Object.values(PoliticalParty);
    for (const state of this.stateFeatures) {
      const reps = this.congress.repsForState(state.abbreviation);
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
      state.tooltipText = `${state.abbreviation} ${Math.round(100 * dem)}-${Math.round(100 * rep)}`;
    }

    this.updateStateColors();
  }

  private computeStateColor(state: any): Color {
    if (this.coloringMode === ColoringMode.Majority) {
      return this.majorityColor(state);
    } else if (this.coloringMode === ColoringMode.Proportional) {
      return this.proportionalColor(state);
    } else {
      return null;
    }
  }

  private proportionalColor(state: any): Color {
    const p = state.seatProportionsByParty[PoliticalParty.Republican];
    const { Democrat, Republican } = NationMapComponent.PartyColors;
    return chromaMix(Democrat, Republican, p, <keyof ColorSpaces> this.chromaMixMode);
  }

  private majorityColor(state: any): Color {
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
