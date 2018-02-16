import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { sortBy } from 'lodash';
import { GeoPath, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson';

import { environment } from '@env/environment';
import { Logger } from '@app/core/logger.service';
import { StaticDataService } from './static-data.service';
import { UsaRegion, UsaRegionsService } from './usa-regions.service';

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
  id: string; // string form of the FIPS identifier
  pathData: string;
  centroid: XYPoint;
  bounds: XYBoundingBox;
}

export class StateFeature implements IStateFeature {
  name: string;
  status: string;
  fips: number;
  postal: string;
  id: string;
  pathData: string;
  centroid: XYPoint;
  bounds: XYBoundingBox;

  constructor(_feature: IStateFeature) {
    Object.assign(this, _feature);
  }

  public get urlSegment(): string {
    return this.postal || '';
  }
}



@Injectable()
export class UsaGeographyService {
  private _isLoading: boolean;
  private _dataObservable: Observable<any>;
  private _stateBordersPathData: string;
  private _stateFeatures: StateFeature[];

  constructor(
    private regions: UsaRegionsService,
    private dataService: StaticDataService,
  ) {
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

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public get dataObservable(): Observable<any> {
    return this._dataObservable;
  }

  public get stateBordersPathData(): string {
    return this._stateBordersPathData;
  }

  public get stateFeatures(): StateFeature[] {
    return this._stateFeatures;
  }

  setNationalAtlas(atlas: any): StateFeature[] {
    const path: GeoPath<any, any> = geoPath();
    const { states } = atlas.objects;

    this._stateBordersPathData = path(mesh(atlas, states, (a: any, b: any) => a !== b));

    const features = feature(atlas, states).features;
    for (const f of features) {
      const region = this.regions.findByFips(f.id);
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

    this._stateFeatures = sortBy(features, ['name']).map(f => new StateFeature(f));

    this._isLoading = false;

    return this.stateFeatures;
  }

}
