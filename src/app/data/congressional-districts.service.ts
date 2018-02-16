import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { toNumber, sortBy } from 'lodash';
import { GeoPath, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson';

import { environment } from '@env/environment';
import { Logger } from '@app/core/logger.service';
import { StaticDataService } from './static-data.service';
import { D3GeoStatePlaneService } from './d3-geo-state-plane.service';

const log = new Logger('Congressional Districts');



interface ITopologyFeature {
  pathData: string;
}

interface IMappableTopology {
  borders: string;
  features: ITopologyFeature[];
}



@Injectable()
export class CongressionalDistrictsService {
  private _isLoading: boolean;
  private _bordersPath: string;
  private _features: any[];

  constructor(
    private dataService: StaticDataService,
    private statePlane: D3GeoStatePlaneService,
  ) {
    this._isLoading = false;
  }

  public fetchState(
    fipsCode: number | string,
    postalCode: string,
    displayWidth: number,
    displayHeight: number,
  ): void {
    this._isLoading = true;
    const dir = environment.geographyDataDirectory;
    let fips = String(fipsCode);
    if (fips.length === 1) {
      fips = '0' + fips;
    }
    this.dataService.fetch(`${dir}/districts/${fips}.json`).pipe(
      map((topo: any) => this.processTopology(topo, postalCode, displayWidth, displayHeight)),
    )
    .subscribe(
      x => {
        this._bordersPath = x.borders;
        this._features = x.features;
        this._isLoading = false;
      }
    );
  }

  private processTopology(
    topology: any,
    postalCode: string,
    displayWidth: number,
    displayHeight: number,
  ): IMappableTopology {
    const projection = this.statePlane.projection(postalCode, displayWidth, displayHeight);
    const path: GeoPath<any, any> = geoPath(projection);
    const { districts } = topology.objects;

    const { features } = feature(topology, districts);
    for (const f of features) {
      f.districtId = toNumber(f.properties.CD115FP);
      f.pathData = path(f);
    }

    return {
      borders: path(mesh(topology, districts)),
      features,
    };
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public get bordersPath(): string {
    return this._bordersPath;
  }

  public get features(): any[] {
    return this._features;
  }
}
