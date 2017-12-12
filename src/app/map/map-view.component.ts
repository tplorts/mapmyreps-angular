import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';

import { toNumber } from 'lodash';

import { select, selectAll, Selection } from 'd3-selection';
import { geoPath, geoAlbersUsa, GeoProjection, GeoPath } from 'd3-geo';
import { json } from 'd3-request';
import { feature, mesh } from 'topojson';

import { Logger } from '../core/logger.service';
import { StateNames, StateAbbreviations } from './usa-states';
import { LegislatorsService, Senator, Representative } from '../data/legislators.service';



const log = new Logger('MapViewComponent');



type SVGSelection = Selection<SVGElement, {}, null, undefined>;

// interface IStateGeometry {
//   pathData: string;
//   feature: any;
// }

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  // @ViewChild('svg') _svg: SVGElement;
  private _options: { width: number, height: number } = { width: 960, height: 600 };

  svg: SVGSelection;
  path: GeoPath<any, any>;
  usaStatesGeoData: any;
  isLoading: boolean;
  statesGroup: SVGSelection;
  dataPromise: Promise<any>;
  bordersData: string;
  // stateGeometries: IStateGeometry[];
  stateFeatures: any[];
  selectedState: any;

  private static isOfState(state: string) {
    return (x: any) => state === x.state;
  }

  constructor(
    private myElement: ElementRef,
    private legislators: LegislatorsService,
  ) {
    this.selectedState = null;

    this.isLoading = true;
    this.dataPromise = new Promise<any>((resolve, reject) => {
      json('https://d3js.org/us-10m.v1.json', (error, data: any) => {
        if (error) {
          reject(error);
          throw error;
        }
        this.usaStatesGeoData = data;
        // this.isLoading = false;
        resolve();
      });
    });
  }

  async ngOnInit() {
    this.matchWindowSize();

    const unequal = (a: any, b: any) => a !== b;

    const svgElement = this.myElement.nativeElement.querySelector('svg');
    this.svg = select(svgElement);
    this.statesGroup = this.svg.select('g.states');

    const projection = geoAlbersUsa()
      .scale(1070)
      .translate([this.width / 2, this.height / 2]);

    this.path = geoPath(/*projection*/);

    await this.dataPromise;
    this.bordersData = this.path(mesh(this.usaStatesGeoData, this.usaStatesGeoData.objects.states, unequal));
    const features = feature(this.usaStatesGeoData, this.usaStatesGeoData.objects.states).features;
    for (const f of features) {
      f.key = f.id;
      f.id = toNumber(f.key) - 1;
    }
    const byFeatureId = (a: any, b: any) => a.id - b.id;
    features.sort(byFeatureId);

    let index = 0;
    for (const f of features) {
      f.name = StateNames[index++];
      f.abbreviation = StateAbbreviations[f.name];
      f.pathData = this.path(f);
    }

    this.stateFeatures = features;

    this.isLoading = false;
  }

  public selectState(state: any) {
    this.selectedState = this.selectedState === state ? null : state;
  }

  public isSelected(state: any): boolean {
    return state && state === this.selectedState;
  }

  public get selectedStateName(): string {
    const state = this.selectedState;
    return state && `${state.name} (${state.abbreviation})`;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.matchWindowSize();
  }

  private matchWindowSize(): void {
    this._options.width = window.innerWidth;
    this._options.height = window.innerHeight;
  }

  public get width(): number {
    return this._options.width;
  }

  public get height(): number {
    return this._options.height;
  }

  private legislatorsOfState<T>(legislators: T[]) {
    return legislators.filter(MapViewComponent.isOfState(this.selectedState.abbreviation));
  }

  public get senatorsOfState(): Senator[] {
    return this.legislatorsOfState(this.legislators.senators);
  }

  public get representativesOfState(): Representative[] {
    return this.legislatorsOfState(this.legislators.representatives);
  }
}
