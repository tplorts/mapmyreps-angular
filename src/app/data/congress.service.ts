import { Injectable } from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';

import { environment } from '../../environments/environment';
import { Logger } from '../core/logger.service';
import { StaticDataService } from './static-data.service';
import { UsaRegionsService } from './usa-regions.service';
import {
  Legislator,
  ILegislator,
  Committee,
  ICommittee,
  ICommitteeMember,
  CommitteeMembershipMap,
  BioguideCommitteesMap,
  ISocialMediaInfo,
  SocialMediaMap,
  ILegislatorSocialMedia,
} from './congress';


const log = new Logger('CongressService');



@Injectable()
export class CongressService {
  private static DataFiles = [
    'legislators-current',
    'committees-current',
    'committee-membership-current',
    'legislators-social-media',
  ];

  private _isLoading: boolean;
  private _legislators: Legislator[];
  private _committees: Committee[];
  private _dataObservable: Observable<any>;
  private _legislatorsByPostal: { [postal: string]: Legislator[] };

  // private static isOfState(state: string) {
  //   return (x: Legislator) => state === x.state;
  // }

  constructor(
    private dataService: StaticDataService,
    private regions: UsaRegionsService,
  ) {
    this.load();
    this._legislatorsByPostal = {};
  }

  public load(): void {
    this._isLoading = true;
    const dir = environment.congressDataDirectory;
    const fetches = CongressService.DataFiles.map(f => this.dataService.fetch(`${dir}/${f}.json`));
    this._dataObservable = new Observable<any>(observer => {
      Observable.forkJoin(...fetches)
      .pipe(map((results: any[]) => this.setData(results)))
      .subscribe(
        (value: any) => observer.next(value),
        e => log.error(e),
        () => observer.complete(),
      );
    });
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public get dataObservable(): Observable<any> {
    return this._dataObservable;
  }

  setData(data: any[]): Legislator[] {
    const [ legislators, committees, memberships, socialMedia ] = data;
    this._committees = committees.map((z: ICommittee) => Committee.create(z));
    const membershipMap = <CommitteeMembershipMap> memberships;
    const committeesForBioguide: BioguideCommitteesMap = {};
    for (const committeeThomasId in membershipMap) { if (membershipMap.hasOwnProperty(committeeThomasId)) {
      const committee = Committee.thomasMap[committeeThomasId];
      const memberBioguideIds = membershipMap[committeeThomasId].map(m => m.bioguide);
      for (const bioguideId of memberBioguideIds) {
        let arr = committeesForBioguide[bioguideId];
        if (!arr) {
          arr = committeesForBioguide[bioguideId] = [];
        }
        arr.push(committee);
      }
    }}
    const socialMediaMap: SocialMediaMap = {};
    const socialInfos = <ILegislatorSocialMedia[]> socialMedia;
    for (const socialInfo of socialInfos) {
      socialMediaMap[socialInfo.id.bioguide] = socialInfo.social;
    }
    const createLegislator = (z: ILegislator) => {
      const { bioguide } = z.id;
      return Legislator.create(z, committeesForBioguide[bioguide], socialMediaMap[bioguide]);
    };
    this._legislators = legislators.map(createLegislator);

    for (const postal of this.regions.allPostalCodes) {
      this._legislatorsByPostal[postal] = this.reps.filter(r => r.statePostal === postal);
    }

    this._isLoading = false;

    return this.reps;
  }

  public get reps(): Legislator[] {
    return this._legislators;
  }

  public repsForPostal(regionPostal: string): Legislator[] {
    return this._legislatorsByPostal[regionPostal];
  }
}
