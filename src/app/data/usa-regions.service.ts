import { Injectable } from '@angular/core';
import { toNumber, sortBy } from 'lodash';

import * as _UsaRegionsJson from 'usa-regions.json';



export interface UsaRegion {
  name: string;
  status: string;
  fips: number;
  postal?: string;
}

const getPostal = (x: UsaRegion) => x.postal;



@Injectable()
export class UsaRegionsService {
  public static readonly PostalExp = /^[A-Z]{2}$/i;
  public static readonly All = <UsaRegion[]> _UsaRegionsJson;
  public static readonly AllPostalCodes = UsaRegionsService.All.filter(getPostal).map(getPostal);
  public static readonly SetOfAllPostalCodes = new Set(UsaRegionsService.AllPostalCodes);

  public static isPostal(str: string) {
    return UsaRegionsService.PostalExp.test(str) && UsaRegionsService.SetOfAllPostalCodes.has(str.toUpperCase());
  }

  constructor() {
  }

  public get allPostalCodes(): Array<string> {
    return UsaRegionsService.AllPostalCodes;
  }

  public findByFips(fips: string | number): UsaRegion {
    const fipsId = toNumber(fips);
    return UsaRegionsService.All.find(r => r.fips === fipsId);
  }

  public findByPostal(postal: string): UsaRegion {
    const postalUpper = postal.toUpperCase();
    return UsaRegionsService.All.find(r => r.postal === postalUpper);
  }

  public isPostal(str: string) {
    return UsaRegionsService.isPostal(str);
  }
}
