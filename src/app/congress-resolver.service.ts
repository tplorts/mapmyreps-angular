import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CongressService } from '@usa-data/congress.service';



@Injectable()
export class CongressResolver implements Resolve<any> {
  constructor(private congress: CongressService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.congress.ready;
  }
}
