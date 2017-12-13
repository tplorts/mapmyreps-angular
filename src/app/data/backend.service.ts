import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { plural } from 'pluralize';



@Injectable()
export class BackendService {

  constructor(private http: Http) { }

  fetchAll(modelNamePlural: string): Observable<any> {
    return this.http.get(`/${modelNamePlural}`, { cache: true })
      .pipe(
        map((res: Response) => res.json()),
      );
  }

  fetchAllClass(modelClass: Function): Observable<any> {
    return this.fetchAll(plural(modelClass.name));
  }

}
