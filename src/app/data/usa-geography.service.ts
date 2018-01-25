import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { toNumber, sortBy } from 'lodash';

import { GeoPath, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson';

import { environment } from '../../environments/environment';
import { Logger } from '../core/logger.service';
import { StaticDataService } from './static-data.service';

import * as _UsaRegions from 'usa-regions.json';
const UsaRegions = <UsaRegion[]> _UsaRegions;

const log = new Logger('USA Geography');



export interface XYPoint {
  x: number;
  y: number;
}

export interface XYBoundingBox {
  bottomLeft: XYPoint;
  topRight: XYPoint;
}

export interface IStateFeature extends UsaRegion {
  id: string; // string form of the FIPS code
  pathData: string;
  centroid: XYPoint;
  bounds: XYBoundingBox;
}



@Injectable()
export class UsaGeographyService {
  private _isLoading: boolean;
  private _dataObservable: Observable<any>;
  private _stateBordersPathData: string;
  private _stateFeatures: IStateFeature[];

  constructor(private dataService: StaticDataService) {
    this._isLoading = true;
    const dir = environment.geographyDataDirectory;
    this._dataObservable = new Observable<any>(observer => {
      this.dataService.fetch(`${dir}/us-atlas-10m.json`)
      .pipe(map((atlasJson: any) => this.setNationalAtlas(atlasJson)))
      .subscribe(
        (value: any) => observer.next(value),
        e => log.error(e),
        () => observer.complete(),
      );
    });
  }

  public get regions(): UsaRegion[] {
    return UsaRegions;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public get dataObservable(): Observable<any> {
    return this._dataObservable;
  }

  public get stateBordersPathData(): string {
    return this._stateBordersPathData;
  }

  public get stateFeatures(): IStateFeature[] {
    return this._stateFeatures;
  }

  setNationalAtlas(atlas: any): IStateFeature[] {
    const path: GeoPath<any, any> = geoPath();
    const { states } = atlas.objects;

    this._stateBordersPathData = path(mesh(atlas, states, (a: any, b: any) => a !== b));

    const features = feature(atlas, states).features;
    for (const f of features) {
      const region = UsaRegions.find(r => r.fipsCode === toNumber(f.id));
      Object.assign(f, region);
      f.pathData = path(f);
      const [ cx, cy ] = path.centroid(f);
      f.centroid = { x: cx, y: cy };
      const [[x0, y0], [x1, y1]] = path.bounds(f);
      f.bounds = {
        bottomLeft: { x: x0, y: y0 },
        topRight: { x: x1, y: y1 },
      };
    }

    this._stateFeatures = sortBy(features, ['name']);

    this._isLoading = false;

    return this.stateFeatures;
  }

}
