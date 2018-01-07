import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';

import { sortBy } from 'lodash';

import { Legislator } from '../data/congress';
import { CongressService } from '../data/congress.service';



interface IRepSet {
  title: string;
  reps: Legislator[];
}



@Component({
  selector: 'app-state-detail',
  templateUrl: './state-detail.component.html',
  styleUrls: ['./state-detail.component.scss']
})
export class StateDetailComponent implements OnInit {
  private _state: any;
  private _repSets: IRepSet[];

  public selectedRep: Legislator;

  @Output() close: EventEmitter<any> = new EventEmitter();

  private static isOfState(state: string) {
    return (x: Legislator) => state === x.state;
  }

  constructor(
    private congress: CongressService,
  ) {
  }

  public get state(): any {
    return this._state;
  }

  @Input()
  public set state(s: any) {
    this._state = s;
    const onceDone = new Subscriber(null, null, () => this.makeRepSets());
    this.congress.dataObservable.subscribe(onceDone);
  }

  ngOnInit() {
    this.selectedRep = null;
  }

  public get stateTitle(): string {
    const {state} = this;
    return state && `${state.name} (${state.abbreviation})`;
  }

  public goBack(): void {
    this.close.emit(null);
  }

  public get isCongressLoading(): boolean {
    return this.congress.isLoading;
  }

  private stateLegislators(): Legislator[] {
    const { reps } = this.congress;
    return reps && reps.filter(StateDetailComponent.isOfState(this.state.abbreviation));
  }

  private makeRepSets() {
    const reps = this.stateLegislators();
    if (reps) {
      this._repSets = [
        {
          title: 'Senators',
          reps: reps.filter(z => z.isSenator()),
        },
        {
          title: 'Representatives',
          reps: sortBy(reps.filter(z => z.isRepresentative()), ['district']),
        }
      ];
    }
  }

  public get repSets(): IRepSet[] {
    return this._repSets;
  }

  public repImageStyle(rep: Legislator): any {
    return {
      backgroundImage: `url('${rep.imageUrl}')`
    };
  }

  public selectRep(rep: Legislator): void {
    this.selectedRep = (!rep || this.selectedRep === rep) ? null : rep;
  }
}
