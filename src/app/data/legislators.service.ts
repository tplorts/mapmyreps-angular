import { Injectable } from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { NextObserver } from 'rxjs/Observer';

import { BackendService } from './backend.service';



export class Senator {}
export class Representative {}


class SSubscriber<T> extends Subscriber<T> {
  constructor(onNext: any, onError: any) {
    super(onNext, onError, () => console.log(`completed`));
  }
}


@Injectable()
export class LegislatorsService {
  private static LegislatorClasses = [ Senator, Representative ];

  private _senators: Senator[];
  private _representatives: Representative[];

  private senatorsSubscriber: SSubscriber<Senator[]>;
  private representativesSubscriber: SSubscriber<Representative[]>;


  constructor(private backend: BackendService) {
    this.senatorsSubscriber = new SSubscriber(
      (data: Senator[]) => this.setSenators(data),
      () => this.setSenators(null),
    );
    this.representativesSubscriber = new SSubscriber(
      (data: Representative[]) => this.setRepresentatives(data),
      () => this.setRepresentatives(null),
    );

    this.fetchAll();
  }

  public get senators(): Senator[] {
    return this._senators;
  }

  public get representatives(): Representative[] {
    return this._representatives;
  }

  fetchAll() {
    this.backend.fetchAll('Senators').subscribe(this.senatorsSubscriber);
    this.backend.fetchAll('Representatives').subscribe(this.representativesSubscriber);
  }

  setSenators(data: Senator[]) {
    this._senators = data;
  }

  setRepresentatives(data: Representative[]) {
    this._representatives = data;
  }
}
