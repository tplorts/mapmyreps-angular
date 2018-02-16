import { Injectable } from '@angular/core';

import { PoliticalParty, AllPoliticalParties } from '@app/data/congress';
import { UsaGeographyService } from '@app/data/usa-geography.service';
import { CongressService } from '@app/data/congress.service';
import { UserOptionsService } from '@app/core/user-options.service';
import { Logger } from '@app/core/logger.service';

const log = new Logger('PoliticalStats');



export interface RegionalPoliticalStats {
  totalSeats: number;
  seatsPerParty: { [party: string]: number };
  seatProportionsPerParty: { [party: string]: number };
}



@Injectable()
export class PoliticalStatsService {
  private _byState: { [postal: string]: RegionalPoliticalStats };

  constructor(
    private geography: UsaGeographyService,
    private congress: CongressService,
    public options: UserOptionsService,
  ) {
    this.geography.dataObservable.subscribe(() => this.compute());
  }

  public ofState(postal: string) {
    return this._byState[postal];
  }

  compute() {
    this._byState = {};
    for (const state of this.geography.stateFeatures) {
      const stateReps = this.congress.repsForPostal(state.postal);
      if (!stateReps) {
        log.warn('got no reps for state', state);
      }
      const totalSeats = stateReps.length;
      const seatsPerParty = {};
      const seatProportionsPerParty = {};
      for (const party of AllPoliticalParties) {
        const nPartySeats = stateReps.filter(r => r.party === party).length;
        seatsPerParty[party] = nPartySeats;
        seatProportionsPerParty[party] = nPartySeats / totalSeats;
      }
      this._byState[state.postal] = {
        totalSeats,
        seatsPerParty,
        seatProportionsPerParty,
      };
    }

  }
}
