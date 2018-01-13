import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';

import { sortBy } from 'lodash';

import { Logger } from '../core/logger.service';
import { Legislator } from '../data/congress';
import { CongressService } from '../data/congress.service';


const log = new Logger('State Detail');



interface IRepSet {
  title: string;
  reps: Legislator[];
}



@Component({
  selector: 'app-state-detail',
  templateUrl: './state-detail.component.pug',
  styleUrls: ['./state-detail.component.scss']
})
export class StateDetailComponent implements OnInit {
  private _state: any;
  private _repSets: IRepSet[];

  public selectedRep: Legislator;

  @Output() close: EventEmitter<any> = new EventEmitter();

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
    if (this.isCongressLoading) {
      const onceDone = new Subscriber(null, null, () => this.makeRepSets());
      this.congress.dataObservable.subscribe(onceDone);
    } else {
      this.makeRepSets();
    }
  }

  ngOnInit() {
    this.selectedRep = null;
  }

  public get stateTitle(): string {
    const {state} = this;
    return state && `${state.name} (${state.abbreviation})`;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.goBack();
    }
  }

  public goBack(): void {
    this.close.emit(null);
  }

  public get isCongressLoading(): boolean {
    return this.congress.isLoading;
  }

  private stateLegislators(): Legislator[] {
    return this.congress.repsForState(this.state.abbreviation);
    // const { reps } = this.congress;
    // return reps && reps.filter(StateDetailComponent.isOfState(this.state.abbreviation));
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

  public selectRepForDistrict(district: number) {
    const { reps } = this.repSets.find(s => s.title === 'Representatives');
    const rep = reps.find(r => r.district === district);
    if (rep) {
      this.selectRep(rep);
    }
  }

  public repTileClass(rep: Legislator): string {
    const selected = rep === this.selectedRep ? 'selected-rep' : '';
    return rep.partyStyleClass + ' ' + selected;
  }
}
