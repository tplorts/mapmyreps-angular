import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscriber } from 'rxjs/Subscriber';
import { isNumber } from 'lodash';

import { Logger } from '../core/logger.service';
import { IStateFeature } from '../data/usa-geography.service';
import { Legislator, Representative } from '../data/congress';
import { RepStatusService } from '../rep-status.service';

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
export class StateDetailComponent implements OnInit, OnDestroy {
  private _state: IStateFeature;
  private _allLegislators: Legislator[];
  private _repSets: IRepSet[];
  private _houseReps: Representative[];
  private iSelectedRep: number;
  private selectionSubscriber: Subscriber<Legislator>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private repStatus: RepStatusService,
  ) {
    this.selectionSubscriber = new Subscriber<Legislator>(nextRep => this.setSelectedRep(nextRep));
  }

  ngOnInit() {
    const { regionFeature, regionReps } = this.route.snapshot.data;
    this._state = regionFeature;
    this._allLegislators = regionReps;
    this.makeRepSets();
    this.repStatus.selection.subscribe(this.selectionSubscriber);
  }

  ngOnDestroy() {
    this.selectionSubscriber.unsubscribe();
  }

  public get state(): IStateFeature {
    return this._state;
  }

  public get stateTitle(): string {
    const {state} = this;
    return state && `${state.name} (${state.postal})`;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        this.router.navigate(['/']);
        break;
      case 'ArrowLeft':
        this.priorRep();
        break;
      case 'ArrowRight':
        this.nextRep();
        break;
      default:
        break;
    }
  }

  private makeRepSets() {
    const reps = this._allLegislators;
    // The list of legislators is already sorted such that senators come before
    // all of the house representatives.
    // Even though there will almost always be 2 Senators, there may be a temporary
    // vacancy; also consider DC, with no senators and one rep in the house.
    // const iHouseReps = reps.findIndex(r => r.isRepresentative());
    // this._houseReps = <Representative[]> reps.slice(iHouseReps);
    this._houseReps = <Representative[]> reps.filter(z => z.isRepresentative());
    this._repSets = [
      {
        title: 'Senators',
        // reps: reps.slice(0, iHouseReps),
        reps: reps.filter(z => z.isSenator()),
      },
      {
        title: 'Representatives',
        reps: this._houseReps,
      }
    ];
  }

  public get repSets(): IRepSet[] {
    return this._repSets;
  }

  public get houseReps(): Representative[] {
    return this._houseReps;
  }

  public repImageStyle(rep: Legislator): any {
    return {
      backgroundImage: `url('${rep.imageUrl}')`
    };
  }

  private setSelectedRep(rep: Legislator) {
    this.iSelectedRep = this.indexOfRep(rep);
    log.debug(this.iSelectedRep, rep && rep.fullName);
  }

  private indexOfRep(rep: Legislator): number {
    if (!rep) {
      return null;
    }
    const { bioguide } = rep.identifiers;
    const byBioguideId = (r: Legislator) => r.identifiers.bioguide === bioguide;
    return this._allLegislators.findIndex(byBioguideId);
  }

  public get isRepSelected(): boolean {
    return isNumber(this.iSelectedRep);
  }

  private selectRepByIndex(index: number) {
    const rep = this._allLegislators[index];
    if (rep) {
      this.router.navigate([ rep.urlSegment ], { relativeTo: this.route });
    }
  }

  public get isOnFirstRep(): boolean {
    return this.iSelectedRep === 0;
  }

  public get isOnLastRep(): boolean {
    return this.iSelectedRep === this._allLegislators.length - 1;
  }

  public nextRep(): void {
    if (this.isRepSelected && !this.isOnLastRep) {
      this.selectRepByIndex(this.iSelectedRep + 1);
    }
  }

  public priorRep(): void {
    if (this.isRepSelected && !this.isOnFirstRep) {
      this.selectRepByIndex(this.iSelectedRep - 1);
    }
  }
}
