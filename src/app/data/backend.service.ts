import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// import * as moment from 'moment-timezone';

import { Logger } from '../core/logger.service';


const log = new Logger('Backend');


interface ILegislatorsResult {
  results: any[];
  lastUpdated: string;
  sourceUrl: string;
}

@Injectable()
export class BackendService {
  private static FetchForBackend = false;

  constructor(private http: Http) { }

  fetchAll(modelNamePlural: string): Observable<any> {
    return this.http.get(`/${modelNamePlural}/get`, { cache: true }).pipe(
      map((res: Response) => res.json()),
      // map((result: ILegislatorsResult) => this.getResultsAndCheck(result, modelNamePlural))
      // delay(Math.round(Math.random() * 2e3)),
    );
  }

  // getResultsAndCheck(result: ILegislatorsResult, modelNamePlural: string) {
  //   if (BackendService.FetchForBackend) {
  //     const yesterday = moment().subtract(1, 'minute');
  //     const lastUpdated = moment(result.lastUpdated);
  //     if (lastUpdated.isBefore(yesterday)) {
  //       log.debug(`${modelNamePlural} were updated ${lastUpdated.fromNow()} - will fetch and submit to backend.`);
  //       this.http.get(result.sourceUrl).subscribe((res: Response) => this.sendRawData(res.text(), modelNamePlural));
  //     }
  //   }
  //   return result.results;
  // }

  // sendRawData(data: string, modelNamePlural: string) {
  //   this.http.post(`/${modelNamePlural}/submitRawData`, { data });
  // }
}
