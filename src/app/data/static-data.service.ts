import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { map } from 'rxjs/operators';

import { Logger } from '@app/core/logger.service';
import { environment } from '@env/environment';



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
