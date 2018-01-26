import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Logger } from '../core/logger.service';
import { IStateFeature } from '../data/usa-geography.service';
import { Legislator, Representative } from '../data/congress';


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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  public get state(): IStateFeature {
    return this._state;
  }

  ngOnInit() {
    this.selectedRep = null;
    this._iSelectedLegislator = null;
    const { regionFeature, regionReps } = this.route.snapshot.data;
    this._state = regionFeature;
    this._allLegislators = regionReps;
    this.makeRepSets();
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
