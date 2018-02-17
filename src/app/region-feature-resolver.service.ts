import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { UsaGeographyService, IStateFeature } from '@usa-data/usa-geography.service';



@Injectable()
export class RegionFeatureResolver implements Resolve<IStateFeature> {
  constructor(private geography: UsaGeographyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStateFeature> {
    const [ rootSegment ] = route.url;
    const postal = rootSegment.path.toUpperCase();
    return this.geography.ready.map(() => this.stateForPostal(postal));
  }

  private stateForPostal(postal: string) {
    return this.geography.stateFeatures.find(s => s.postal === postal);
  }
}
