import { Injectable } from '@angular/core';
import { toNumber, sortBy } from 'lodash';

import * as _UsaRegions from 'usa-regions.json';



export interface UsaRegion {
  name: string;
  status: string;
  fips: number;
  postal?: string;
}



@Injectable()
export class UsaRegionsService {
  public static readonly PostalExp = /^[A-Z]{2}$/i;

  public readonly all = <UsaRegion[]> _UsaRegions;
  public readonly allPostalCodes: string[];
  private readonly _allPostalCodesSet: Set<string>;


  constructor() {
    const regionsWithPostal = this.all.filter(r => r.postal);
    this.allPostalCodes = regionsWithPostal.map(r => r.postal);
    this._allPostalCodesSet = new Set<string>(this.allPostalCodes);
  }

  public findByFips(fips: string | number): UsaRegion {
    const fipsId = toNumber(fips);
    return this.all.find(r => r.fips === fipsId);
  }

  public findByPostal(postal: string): UsaRegion {
    const postalUpper = postal.toUpperCase();
    return this.all.find(r => r.postal === postalUpper);
  }

  public isPostal(str: string) {
    return UsaRegionsService.PostalExp.test(str) && this._allPostalCodesSet.has(str);
  }
}
