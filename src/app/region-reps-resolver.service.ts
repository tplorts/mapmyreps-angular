import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { sortBy } from 'lodash';

import { Legislator } from '@usa-data/congress';
import { CongressService } from '@usa-data/congress.service';



@Injectable()
export class RegionRepsResolver implements Resolve<Legislator[]> {
  constructor(private congress: CongressService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Legislator[]> {
    const [ rootSegment ] = route.url;
    const postal = rootSegment.path.toUpperCase();
    return this.congress.ready.map(() => this.repsForPostal(postal));
  }

  private repsForPostal(postal: string): Legislator[] {
    return sortBy(this.congress.repsForPostal(postal), ['sortingDistrict']);
  }
}
