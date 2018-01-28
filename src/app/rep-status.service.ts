import { Injectable, EventEmitter } from '@angular/core';
import { Legislator } from './data/congress';

@Injectable()
export class RepStatusService {
  private readonly repSelectedEmitter = new EventEmitter<Legislator>();

  constructor() { }

  public select(rep: Legislator) {
    this.repSelectedEmitter.next(rep);
  }

  public get selection() {
    return this.repSelectedEmitter.asObservable();
  }
}
