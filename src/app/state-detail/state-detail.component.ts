import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscriber } from 'rxjs/Subscriber';

import { sortBy } from 'lodash';

import { Logger } from '../core/logger.service';
import { UsaGeographyService, IStateFeature } from '../data/usa-geography.service';
import { Legislator, Representative } from '../data/congress';
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
  private _state: IStateFeature;
  private _allLegislators: Legislator[];
  private _iSelectedLegislator: number;
  private _repSets: IRepSet[];
  private _houseReps: Representative[];

  public selectedRep: Legislator;

  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private geography: UsaGeographyService,
    private congress: CongressService,
  ) {
  }

  public get state(): IStateFeature {
    return this._state;
  }

  @Input()
  public set state(s: IStateFeature) {
    this._state = s;
    if (this.congress.isLoading) {
      this.congress.dataObservable.subscribe(null, null, () => this.makeRepSets());
    } else {
      this.makeRepSets();
    }
  }

  ngOnInit() {
    this.selectedRep = null;
    this._iSelectedLegislator = null;
    log.debug(this.route.snapshot.url[0].path);
    const requestedPostal = this.route.snapshot.url[0].path.toUpperCase();
    if (this.geography.isLoading) {
      this.geography.dataObservable.subscribe(null, null, () => this.setStatePostal(requestedPostal));
    } else {
      this.setStatePostal(requestedPostal);
    }
  }

  private setStatePostal(postal: string) {
    this.state = this.geography.stateFeatures.find(s => s.postal === postal);
  }

  public get stateTitle(): string {
    const {state} = this;
    return state && `${state.name} (${state.postal})`;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        this.goBack();
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

  public goBack(): void {
    // this.close.emit(null);
    this.location.back();
  }

  public get isLoading(): boolean {
    return this.congress.isLoading || this.geography.isLoading || !this.state || !this.repSets;
  }

  public get isReady(): boolean {
    return !!this.repSets;
  }

  private stateLegislators(): Legislator[] {
    return this.congress.repsForPostal(this.state.postal);
  }

  private makeRepSets() {
    const reps = this._allLegislators = sortBy(this.stateLegislators(), ['sortingDistrict']);
    if (reps) {
      this._houseReps = <Representative[]> reps.filter(z => z.isRepresentative());
      this._repSets = [
        {
          title: 'Senators',
          reps: reps.filter(z => z.isSenator()),
        },
        {
          title: 'Representatives',
          reps: this._houseReps,
        }
      ];
    }
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

  public selectRep(rep: Legislator): void {
    this.selectedRep = (!rep || this.selectedRep === rep) ? null : rep;
    if (this.selectedRep) {
      const byBioguideId = (r: Legislator) => r.identifiers.bioguide === this.selectedRep.identifiers.bioguide;
      this._iSelectedLegislator = this._allLegislators.findIndex(byBioguideId);
    } else {
      this._iSelectedLegislator = null;
    }
  }

  public selectRepByIndex(index: number) {
    this._iSelectedLegislator = index;
    this.selectedRep = this._allLegislators[index];
  }

  public get isRepSelected(): boolean {
    return !!this.selectedRep;
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

  public get isOnFirstRep(): boolean {
    return this._iSelectedLegislator === 0;
  }

  public get isOnLastRep(): boolean {
    return this._iSelectedLegislator === this._allLegislators.length - 1;
  }

  public nextRep(): void {
    if (this.isRepSelected && !this.isOnLastRep) {
      this.selectRepByIndex(this._iSelectedLegislator + 1);
    }
  }

  public priorRep(): void {
    if (this.isRepSelected && !this.isOnFirstRep) {
      this.selectRepByIndex(this._iSelectedLegislator - 1);
    }
  }
}
