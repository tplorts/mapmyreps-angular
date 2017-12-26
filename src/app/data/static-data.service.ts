import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { Logger } from '../core/logger.service';

const log = new Logger('Backend');

@Injectable()
export class StaticDataService {
  private baseUrl = 'http://usa-government-info.theodoria.net/data';

  constructor(private http: Http) { }

  fetch(filename: string) {
    return this.http.get(`${this.baseUrl}/${filename}`, { cache: true }).pipe(
      map((res: Response) => res.json()),
    );
  }

}
