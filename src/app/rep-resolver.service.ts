import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Legislator } from '@usa-data/congress';



@Injectable()
export class RepResolver implements Resolve<Legislator> {
  constructor() {}

  resolve(route: ActivatedRouteSnapshot): Observable<Legislator> {
    const { regionReps } = route.parent.data;
    const segmentLower = route.paramMap.get('repSegment').toLowerCase();
    const rep = regionReps.find((r: Legislator) => r.urlSegment.toLowerCase() === segmentLower);
    return Observable.of(rep);
  }
}
