import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { UsaGeographyService, IStateFeature } from '@usa-data/usa-geography.service';



@Injectable()
export class RegionFeatureResolver implements Resolve<IStateFeature> {
  constructor(private geography: UsaGeographyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStateFeature> {
    const [ rootSegment ] = route.url;
    const postal = rootSegment.path.toUpperCase();

    if (this.geography.isLoading) {
      return this.geography.dataObservable.take(1).map(() => this.stateForPostal(postal));
    } else {
      return Observable.of(this.stateForPostal(postal));
    }
  }

  private stateForPostal(postal: string) {
    return this.geography.stateFeatures.find(s => s.postal === postal);
  }
}
