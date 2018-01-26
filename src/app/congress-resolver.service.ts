import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { CongressService } from './data/congress.service';



@Injectable()
export class CongressResolver implements Resolve<any> {
  constructor(private congress: CongressService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (this.congress.isLoading) {
      return this.congress.dataObservable.take(1).map(() => null);
    } else {
      return Observable.of(null);
    }
  }
}
