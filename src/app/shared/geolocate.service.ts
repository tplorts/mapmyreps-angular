import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { isEqual } from 'lodash';

import { Logger } from '../core/logger.service';


const log = new Logger('Geolocate');


interface IGeoCodeResults {
  status: string;
  results: any[];
}


@Injectable()
export class GeolocateService {

  constructor(private http: Http) {}

  public locate() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const success = (pos: any) => {
      console.log('Your current position is:', pos);
      const { latitude, longitude } = pos.coords;
      const url = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false`;
      const toJSON = (res: Response) => res.json();
      this.http.get(url, { cache: true }).pipe(map(toJSON)).subscribe(obj => this.processLocationResults(obj));
    };

    function error(err: any) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  public processLocationResults(obj: IGeoCodeResults) {
    if (obj.status !== 'OK') {
      return;
    }
    const { results } = obj;
    const StateType = [ 'administrative_area_level_1', 'political' ];
    const CountryType = [ 'country', 'political' ];
    const countryResult = results.find(r => isEqual(r.types, CountryType));
    if (!countryResult) {
      return;
    }
    const [ country ] = countryResult.address_components;
    if (country.short_name !== 'US') {
      return;
    }
    const stateResult = results.find(r => isEqual(r.types, StateType));
    if (!stateResult) {
      return;
    }
    const state = stateResult.address_components.find((r: any) => isEqual(r.types, StateType));
    const abbr = state.short_name;
    if (!abbr) {
      return;
    }

    return abbr;
  }

}
