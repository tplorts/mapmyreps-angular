import { Component } from '@angular/core';

import { sortBy } from 'lodash';

import { Logger } from '../core/logger.service';
import { CongressService } from '../data/congress.service';
import { UsaGeographyService } from '../data/usa-geography.service';
import { Legislator, Senator, Representative } from '../data/congress';



const log = new Logger('MapViewComponent');



interface IRepSet {
  title: string;
  reps: Legislator[];
}

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent {

  private _options: { width: number, height: number } = { width: 960, height: 600 };

  public selectedState: any;
  public selectedRep: Legislator;

  private _repSets: IRepSet[];

  public socialMedia = [
    { icon: 'twitter', urlGetter: 'twitterUrl' },
    { icon: 'facebook', urlGetter: 'facebookUrl' },
    { icon: 'youtube', urlGetter: 'youtubeChannelUrl' },
    { icon: 'instagram', urlGetter: 'instagramUrl' },
  ];

  public stateMapOptions = {
    width: 256,
    height: 256,
    padding: 32,
  };

  private static isOfState(state: string) {
    return (x: Legislator) => state === x.state;
  }

  constructor(
    private congress: CongressService,
    private geography: UsaGeographyService,
  ) {
    this.selectedState = null;
    this.selectedRep = null;
  }

  public get stateFeatures(): any[] {
    return this.geography.stateFeatures;
  }

  public get stateBordersPathData(): string {
    return this.geography.stateBordersPathData;
  }

  public selectState(state: any) {
    this.selectedRep = null;
    this.selectedState = (!state || this.selectedState === state) ? null : state;
    if (this.selectedState) {
      const reps = this.activeStateLegislators();
      if (reps) {
        this._repSets = [
          {
            title: 'Senators',
            reps: reps.filter(z => z.isSenator()),
          },
          {
            title: 'Representatives',
            reps: sortBy(reps.filter(z => z.isRepresentative()), ['district']),
          }
        ];
      }
    }
  }

  public isSelected(state: any): boolean {
    return state && state === this.selectedState;
  }

  public get selectedStateName(): string {
    const state = this.selectedState;
    return state && `${state.name} (${state.abbreviation})`;
  }

  public stateTransform(state: any): string {
    const [[x0, y0], [x1, y1]] = this.selectedState.bounds;
    const [ x, y ] = [ (x0 + x1) / 2, (y0 + y1) / 2 ];
    const stateWidth = x1 - x0;
    const stateHeight = y1 - y0;
    const { width, height, padding } = this.stateMapOptions;
    const mapCenterX = width / 2;
    const mapCenterY = height / 2;
    const mapWidth = width - 2 * padding;
    const mapHeight = height - 2 * padding;
    const xScale = mapWidth / stateWidth;
    const yScale = mapHeight / stateHeight;
    const choose = (xScale > 1 || yScale > 1) ? Math.min : Math.max;
    const scale = choose(xScale, yScale);
    return `translate(${mapCenterX}, ${mapCenterY}) scale(${scale}) translate(${-x}, ${-y})`;
  }

  public get width(): number {
    return this._options.width;
  }

  public get height(): number {
    return this._options.height;
  }

  public get isCongressLoading(): boolean {
    return this.congress.isLoading;
  }

  private activeStateLegislators(): Legislator[] {
    const { reps } = this.congress;
    return reps && reps.filter(MapViewComponent.isOfState(this.selectedState.abbreviation));
  }

  public get repSets(): IRepSet[] {
    return this._repSets;
  }

  public repImageStyle(rep: Legislator): any {
    return {
      backgroundImage: `url('${rep.imageUrl}')`
    };
  }

  public selectRep(rep: Legislator): void {
    this.selectedRep = (!rep || this.selectedRep === rep) ? null : rep;
  }
}
