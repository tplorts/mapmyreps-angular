import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { UsaGeographyService, IStateFeature } from './data/usa-geography.service';



export interface INationGeography {
  features: Array<IStateFeature | any>;
  borders: string;
}



@Injectable()
export class NationFeaturesResolver implements Resolve<INationGeography> {
  constructor(private geography: UsaGeographyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INationGeography> {
    if (this.geography.isLoading) {
      return this.geography.dataObservable.take(1).map(() => this.result());
    } else {
      return Observable.of(this.result());
    }
  }

  private result(): INationGeography {
    return {
      features: this.geography.stateFeatures,
      borders: this.geography.stateBordersPathData,
    };
  }
}
