import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { Logger } from '../core/logger.service';
import { environment } from '../../environments/environment';


const log = new Logger('Backend');

@Injectable()
export class StaticDataService {
  private baseUrl = environment.staticDataUrl;

  constructor(private http: Http) { }

  fetch(filename: string) {
    return this.http.get(`${this.baseUrl}/${filename}`, { cache: true }).pipe(
      map((res: Response) => res.json()),
    );
  }

}
