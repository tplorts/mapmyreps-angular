import { Component, OnInit, Input } from '@angular/core';

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

  public stateMapOptions = {
    width: 256,
    height: 256,
    padding: 32,
  };

  private _state: any;

  public selectedRep: Legislator;

  private _repSets: IRepSet[];

  private static isOfState(state: string) {
    return (x: Legislator) => state === x.state;
  }

  constructor(
    private congress: CongressService,
  ) {
    this.selectedRep = null;

  }

  public get state(): any {
    return this._state;
  }

  @Input()
  public set state(s: any) {
    this.selectedRep = null;
    this._state = s;
    if (this._state) {
      const reps = this.stateLegislators();
      // TODO: if !reps, subscribe so that we can filter once downloaded
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
  }

  ngOnInit() {
  }

  public get stateTitle(): string {
    const {state} = this;
    return state && `${state.name} (${state.abbreviation})`;
  }

  public get isCongressLoading(): boolean {
    return this.congress.isLoading;
  }

  private stateLegislators(): Legislator[] {
    const { reps } = this.congress;
    return reps && reps.filter(StateDetailComponent.isOfState(this.state.abbreviation));
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

  public stateTransform(state: any): string {
    const [[x0, y0], [x1, y1]] = this.state.bounds;
    const [ x, y ] = [ (x0 + x1) / 2, (y0 + y1) / 2 ];
    const stateWidth = x1 - x0;
    const stateHeight = y1 - y0;
    const { width, height, padding } = this.stateMapOptions;
    const mapCenterX = width / 2;
    const mapCenterY = height / 2;
    const mapWidth = width - 2 * padding;
    const mapHeight = height - 2 * padding;
    const xScale = mapWidth / stateWidth;
    const yScale = mapHeight / stateHeight;
    const choose = (xScale > 1 || yScale > 1) ? Math.min : Math.max;
    const scale = choose(xScale, yScale);
    return `translate(${mapCenterX}, ${mapCenterY}) scale(${scale}) translate(${-x}, ${-y})`;
  }


}
