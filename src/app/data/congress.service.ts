import { Injectable } from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';

import { environment } from '../../environments/environment';
import { Logger } from '../core/logger.service';
import { StaticDataService } from './static-data.service';
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

  constructor(private dataService: StaticDataService) {
    this._isLoading = true;
    const dir = environment.congressDataDirectory;
    const fetches = CongressService.DataFiles.map(f => this.dataService.fetch(`${dir}/${f}.json`));
    Observable.forkJoin(...fetches).subscribe(
      results => this.setData(results),
      e => log.error(e),
    );
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  setData(data: any[]) {
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

    this._isLoading = false;
  }

  public get reps(): Legislator[] {
    return this._legislators;
  }
}
