import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, catchError } from 'rxjs/operators';



@Injectable()
export class BackendService {

  constructor(private http: Http) { }

  fetchAll(modelNamePlural: string): Observable<any> {
    return this.http.get(`/${modelNamePlural}`, { cache: true })
      .pipe(
        map((res: Response) => res.json()),
        catchError(() => of(`Error in requesting ${modelNamePlural}`))
      );
  }

}
