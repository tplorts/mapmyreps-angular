import { Injectable } from '@angular/core';

import { toNumber, sortBy } from 'lodash';

import { GeoPath, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson';

import { environment } from '../../environments/environment';
import { Logger } from '../core/logger.service';
import { StaticDataService } from './static-data.service';

import * as _UsaRegions from 'usa-regions.json';
const UsaRegions = <UsaRegion[]> _UsaRegions;



const log = new Logger('Congressional Districts');



@Injectable()
export class CongressionalDistrictsService {
  private _isLoading: boolean;
  private _bordersPath: string;
  private _features: any[];
  private _featuresByState: { [abbreviation: string]: Array<any> };


  constructor(private dataService: StaticDataService) {
    this._isLoading = false;
    const dir = environment.geographyDataDirectory;
    this.dataService.fetch(`${dir}/cd114.json`).subscribe(
      x => this.setDistricts(x),
    );
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  // public get stateBordersPathData(): string {
  //   return this._stateBordersPathData;
  // }

  // public get stateFeatures(): any[] {
  //   return this._stateFeatures;
  // }

  setDistricts(cd: any) {
    const path: GeoPath<any, any> = geoPath();
    const { cd114: districts } = cd.objects;

    this._bordersPath = path(mesh(cd, districts, (a: any, b: any) => a !== b));

    const features = sortBy(feature(cd, districts).features.filter(f => /^\d{4}$/.test(f.id)), ['id']);
    const byState = {};

    for (const f of features) {
      // log.debug(f.id);
      f.regionId = toNumber(f.id.substring(0, 2));
      f.districtId = toNumber(f.id.substring(2));
      // const stateFipsCode = toNumber(f.regionId);
      const region = UsaRegions.find(r => r.fipsCode === f.regionId);
      // log.debug(region.name, f.districtId);
      // f.name = region.name;
      // f.regionAbbreviation = region.abbreviation;
      // f.regionType = region.status;
      f.pathData = path(f);
      f.centroid = path.centroid(f);
      f.bounds = path.bounds(f);

      const abbr = region.abbreviation;
      let stateDistricts = byState[abbr];
      if (!stateDistricts) {
        stateDistricts = byState[abbr] = [];
      }
      stateDistricts.push(f);
    }

    this._features = features;
    this._featuresByState = byState;
    // log.debug(this._featuresByState);
  }

  public districtsFor(abbreviation: string): any[] {
    return this._featuresByState[abbreviation];
  }
}
