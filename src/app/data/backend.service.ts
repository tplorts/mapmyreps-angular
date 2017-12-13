import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {
  map,
  // delay
} from 'rxjs/operators';



@Injectable()
export class BackendService {

  constructor(private http: Http) { }

  fetchAll(modelNamePlural: string): Observable<any> {
    return this.http.get(`/${modelNamePlural}`, { cache: true }).pipe(
      map((res: Response) => res.json()),
      // delay(Math.round(Math.random() * 2e3)),
    );
  }

}
