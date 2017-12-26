import { Injectable } from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { NextObserver } from 'rxjs/Observer';

import { StaticDataService } from './static-data.service';
import { Legislator, ILegislator } from './legislator';




class SSubscriber<T> extends Subscriber<T> {
  constructor(private onData: any) {
    super(onData, e => console.error(e), () => console.log(`completed`));
  }
}


@Injectable()
export class LegislatorsService {
  private _reps: Legislator[];
  private repsSubscriber: SSubscriber<Legislator[]>;

  constructor(private dataService: StaticDataService) {
    this._reps = null;
    this.repsSubscriber = new SSubscriber((data: ILegislator[]) => this.setReps(data));

    this.fetchAll();
  }

  public get reps(): Legislator[] {
    return this._reps;
  }

  fetchAll() {
    this.dataService.fetch('legislators-current.json').subscribe(this.repsSubscriber);
  }

  setReps(data: ILegislator[]) {
    this._reps = data.map(obj => Legislator.create(obj));
  }
}
