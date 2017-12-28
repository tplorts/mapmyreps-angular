import { Component, OnInit } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { toNumber, isEqual, sortBy } from 'lodash';

import { GeoPath, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson';

import { Logger } from '../core/logger.service';
import { CongressService } from '../data/congress.service';
import { Legislator, Senator, Representative } from '../data/congress';

import * as UsaTopology from 'us-atlas/us/10m.json';
import * as _UsaRegions from 'usa-regions.json';


const UsaRegions = <UsaRegion[]> _UsaRegions;
// The USA Regions imported from json are already sorted by name.
// The map here does not include territories, so filter those out.
const typeExp = /^(state|district)$/;
const StatesAndDistricts = UsaRegions.filter(r => typeExp.test(r.type));



const log = new Logger('MapViewComponent');

interface IGeoCodeResults {
  status: string;
  results: any[];
}

interface IRepSet {
  title: string;
  reps: Legislator[];
}

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  private _options: { width: number, height: number } = { width: 960, height: 600 };
  private shuffleIntervalId: number;

  public stateBordersPathData: string;
  public stateFeatures: any[];
  public selectedState: any;
  public selectedRep: Legislator;

  private _repSets: IRepSet[];

  public socialMedia = [
    { icon: 'twitter', urlGetter: 'twitterUrl' },
    { icon: 'facebook', urlGetter: 'facebookUrl' },
    { icon: 'youtube', urlGetter: 'youtubeChannelUrl' },
    { icon: 'instagram', urlGetter: 'instagramUrl' },
  ];

  private static isOfState(state: string) {
    return (x: Legislator) => state === x.state;
  }

  constructor(
    private congress: CongressService,
    private http: Http,
  ) {
    this.selectedState = null;
    this.selectedRep = null;
    this.shuffleIntervalId = null;
  }

  async ngOnInit() {
    const unequal = (a: any, b: any) => a !== b;
    const path: GeoPath<any, any> = geoPath();
    const StateGeometries = UsaTopology.objects.states;
    const borders = path(mesh(UsaTopology, StateGeometries, unequal));
    const features = feature(UsaTopology, StateGeometries).features;

    // The features come with a numeric id, in string form
    for (const f of features) {
      f.identifier = toNumber(f.id);
    }
    // Once sorted by this numeric id, the state features are ordered by
    // the name of the state/distric.
    const byIdentifier = (a: any, b: any) => a.identifier - b.identifier;
    features.sort(byIdentifier);

    // Now, each element of features and StatesAndDistricts arrays should
    // line up according to index.
    let index = 0;
    for (const f of features) {
      const Region = StatesAndDistricts[index++];
      f.name = Region.name;
      f.abbreviation = Region.abbreviation;
      f.regionType = Region.type;
      f.pathData = path(f);
      f.centroid = path.centroid(f);
    }

    // log.debug('keys of a feature', Object.keys(features[0]));

    this.stateFeatures = features;
    this.stateBordersPathData = borders;
  }

  public selectForLocation(): void {
    this.selectState(this.stateOfPresentLocation());
  }

  public stateOfPresentLocation(): any {
    return this.stateFeatureForAbbreviation(this.abbrevationOfPresentState());
  }

  public abbrevationOfPresentState(): string {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const success = (pos: any) => {
      console.log('Your current position is:', pos);
      const { latitude, longitude } = pos.coords;
      const url = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false`;
      const toJSON = (res: Response) => res.json();
      this.http.get(url, { cache: true }).pipe(map(toJSON)).subscribe(obj => this.processLocationResults(obj));
    };

    function error(err: any) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

    return null;
  }

  public processLocationResults(obj: IGeoCodeResults) {
    if (obj.status !== 'OK') {
      return;
    }
    const { results } = obj;
    const StateType = [ 'administrative_area_level_1', 'political' ];
    const CountryType = [ 'country', 'political' ];
    const countryResult = results.find(r => isEqual(r.types, CountryType));
    if (!countryResult) {
      return;
    }
    const [ country ] = countryResult.address_components;
    if (country.short_name !== 'US') {
      return;
    }
    const stateResult = results.find(r => isEqual(r.types, StateType));
    if (!stateResult) {
      return;
    }
    const state = stateResult.address_components.find((r: any) => isEqual(r.types, StateType));
    const abbr = state.short_name;
    if (!abbr) {
      return;
    }

    this.selectState(this.stateFeatureForAbbreviation(abbr));
  }

  public shuffle(): void {
    if (this.isShuffling()) {
      return;
    }
    this.shuffleIntervalId = window.setInterval(() => this.selectRandomState(), 150);
    const time = Math.round(Math.random() * 5e3);
    const stop = () => {
      window.clearInterval(this.shuffleIntervalId);
      this.shuffleIntervalId = null;
    };
    window.setTimeout(stop, time);
  }

  public isShuffling(): boolean {
    return !!this.shuffleIntervalId;
  }

  public selectRandomState(): void {
    this.selectState(this.randomStateFeature());
  }

  public randomStateFeature(): any {
    return this.stateFeatureForAbbreviation(this.randomAbbrevation());
  }

  public randomAbbrevation(): string {
    return StatesAndDistricts[Math.floor(Math.random() * StatesAndDistricts.length)].abbreviation;
  }

  public stateFeatureForAbbreviation(abbreviation: string) {
    return this.stateFeatures.find(sf => sf.abbreviation === abbreviation);
  }

  public selectState(state: any) {
    this.selectedRep = null;
    this.selectedState = (!state || this.selectedState === state) ? null : state;
    if (this.selectedState) {
      const [ x, y ] = this.selectedState.centroid;
      log.debug(`selected: ${this.selectedStateName} (${x}, ${y})`);
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

  public get width(): number {
    return this._options.width;
  }

  public get height(): number {
    return this._options.height;
  }

  public get allReps(): Legislator[] {
    return this.congress.reps;
  }

  private activeStateLegislators(): Legislator[] {
    return this.allReps && this.allReps.filter(MapViewComponent.isOfState(this.selectedState.abbreviation));
  }

  public get repSets(): IRepSet[] {
    return this._repSets;
  }

  public hasCommittees(representative: Legislator): boolean {
    // const {committees} = representative;
    // return committees && committees.length > 0;
    return false;
  }

  // public committeeList(representative: Representative): string {
  //   return this.hasCommittees(representative) ? representative.committees.join(', ') : 'Member of no committees';
  // }

  public repImageStyle(rep: Legislator): any {
    return {
      backgroundImage: `url('${rep.imageUrl}')`
    };
  }

  public selectRep(rep: Legislator): void {
    this.selectedRep = (!rep || this.selectedRep === rep) ? null : rep;
    // log.debug(rep.committees);
    // this.selectedRep = rep;
  }
}
