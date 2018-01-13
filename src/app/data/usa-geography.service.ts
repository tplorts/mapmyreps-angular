import { Injectable } from '@angular/core';

import { toNumber } from 'lodash';

import { GeoPath, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson';

import { environment } from '../../environments/environment';
import { Logger } from '../core/logger.service';
import { StaticDataService } from './static-data.service';

import * as _UsaRegions from 'usa-regions.json';
const UsaRegions = <UsaRegion[]> _UsaRegions;



const log = new Logger('USA Geography');



@Injectable()
export class UsaGeographyService {
  private _isLoading: boolean;
  private _stateBordersPathData: string;
  private _stateFeatures: any[];

  constructor(private dataService: StaticDataService) {
    this._isLoading = false;
    const dir = environment.geographyDataDirectory;
    this.dataService.fetch(`${dir}/us-atlas-10m.json`).subscribe(
      atlasResult => this.setNationalAtlas(atlasResult),
    );
  }

  public get regions(): UsaRegion[] {
    return UsaRegions;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public get stateBordersPathData(): string {
    return this._stateBordersPathData;
  }

  public get stateFeatures(): any[] {
    return this._stateFeatures;
  }

  setNationalAtlas(atlas: any) {
    const path: GeoPath<any, any> = geoPath();
    const { states } = atlas.objects;

    this._stateBordersPathData = path(mesh(atlas, states, (a: any, b: any) => a !== b));

    const features = feature(atlas, states).features;
    for (const f of features) {
      const region = UsaRegions.find(r => r.fipsCode === toNumber(f.id));
      f.name = region.name;
      f.abbreviation = region.abbreviation;
      f.regionType = region.status;
      f.pathData = path(f);
      f.centroid = path.centroid(f);
      f.bounds = path.bounds(f);
    }
    this._stateFeatures = features;
  }

}
