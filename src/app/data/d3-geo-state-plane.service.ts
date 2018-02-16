// Origin: https://github.com/gka/d3-geo-state-plane

import { Injectable } from '@angular/core';
import {
  geoAlbersUsa,
  geoAlbers,
  geoMercator,
  geoTransverseMercator,
  geoConicConformal,
} from 'd3-geo';

import * as StatePlanes from 'state-planes.json';



@Injectable()
export class D3GeoStatePlaneService {

  private static readonly ProjectionFns = {
    albers: geoAlbers,
    merc: geoMercator,
    tmerc: geoTransverseMercator,
    lcc: geoConicConformal,
  };

  constructor() { }

  public projection(statePostal: string, width: number, height: number) {
    const def = StatePlanes[statePostal];
    if (!def) {
      return geoAlbersUsa();
    }
    const projFn = D3GeoStatePlaneService.ProjectionFns[def.proj];
    const proj = projFn();
    if (def.rotate) {
      proj.rotate(def.rotate);
    }
    if (def.parallels) {
      proj.parallels(def.parallels);
    }
    if (def.bounds) {
      const b = def.bounds;
      const s = 0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
      const t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
      proj.scale(s).translate(t);
    }
    return proj;
  }
}
