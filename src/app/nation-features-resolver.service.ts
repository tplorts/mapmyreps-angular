import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { UsaGeographyService, IStateFeature } from '@usa-data/usa-geography.service';



export interface INationGeography {
  features: Array<IStateFeature | any>;
  borders: string;
}

@Injectable()
export class NationFeaturesResolver implements Resolve<INationGeography> {
  constructor(private geography: UsaGeographyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INationGeography> {
    return this.geography.ready.map(() => this.result());
  }

  private result(): INationGeography {
    return {
      features: this.geography.stateFeatures,
      borders: this.geography.stateBordersPathData,
    };
  }
}
