import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { toNumber, sortBy } from 'lodash';

import { GeoPath, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson';

import { environment } from '../../environments/environment';
import { Logger } from '../core/logger.service';
import { StaticDataService } from './static-data.service';
import { D3GeoStatePlaneService } from './d3-geo-state-plane.service';

import * as _UsaRegions from 'usa-regions.json';
const UsaRegions = <UsaRegion[]> _UsaRegions;



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
        log.debug(x);
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
    log.debug(projection);

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

  // setDistricts(cd: any) {
  //   const path: GeoPath<any, any> = geoPath();
  //   const { cd114: districts } = cd.objects;

  //   this._bordersPath = path(mesh(cd, districts, (a: any, b: any) => a !== b));

  //   const features = sortBy(feature(cd, districts).features.filter(f => /^\d{4}$/.test(f.id)), ['id']);
  //   const byState = {};

  //   for (const f of features) {
  //     // log.debug(f.id);
  //     f.regionId = toNumber(f.id.substring(0, 2));
  //     f.districtId = toNumber(f.id.substring(2));
  //     // const stateFipsCode = toNumber(f.regionId);
  //     const region = UsaRegions.find(r => r.fipsCode === f.regionId);
  //     // log.debug(region.name, f.districtId);
  //     // f.name = region.name;
  //     // f.regionAbbreviation = region.abbreviation;
  //     // f.regionType = region.status;
  //     f.pathData = path(f);
  //     f.centroid = path.centroid(f);
  //     f.bounds = path.bounds(f);

  //     const abbr = region.abbreviation;
  //     let stateDistricts = byState[abbr];
  //     if (!stateDistricts) {
  //       stateDistricts = byState[abbr] = [];
  //     }
  //     stateDistricts.push(f);
  //   }

  //   this._features = features;
  //   this._featuresByState = byState;
  //   // log.debug(this._featuresByState);
  // }

  // public districtsFor(abbreviation: string): any[] {
  //   return this._featuresByState[abbreviation];
  // }
}
