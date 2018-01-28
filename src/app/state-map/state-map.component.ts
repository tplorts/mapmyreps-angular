import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IStateFeature } from '../data/usa-geography.service';
import { CongressionalDistrictsService } from '../data/congressional-districts.service';
import { Legislator, Representative } from '../data/congress';



@Component({
  selector: 'app-state-map',
  templateUrl: './state-map.component.pug',
  styleUrls: ['./state-map.component.scss']
})
export class StateMapComponent implements OnInit {

  @Input() state: IStateFeature;
  @Input() houseReps: Representative[];

  public stateMapOptions = {
    width: 320,
    height: 320,
    padding: 16,
  };

  constructor(
    private districts: CongressionalDistrictsService,
  ) {}

  ngOnInit() {
    const { id, postal } = this.state;
    const { width, height, padding } = this.stateMapOptions;
    const p = 2 * padding;
    this.districts.fetchState(id, postal, width - p, height - p);
  }

  public get stateTransform(): string {
    const { topRight, bottomLeft } = this.state.bounds;
    const { x: x0, y: y0 } = bottomLeft;
    const { x: x1, y: y1 } = topRight;
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

  public get hasDistrictData(): boolean {
    return !this.districts.isLoading;
  }

  public get districtBorders(): string {
    return this.districts.bordersPath;
  }

  public get districtFeatures(): any[] {
    return this.districts.features;
  }

  public get stateWithDistrictsTransform(): string {
    const { padding } = this.stateMapOptions;
    return `translate(${padding}, ${padding})`;
  }

  public repLink(district: any): string {
    const rep = this.districtRep(district);
    return rep && rep.urlSegment;
  }

  private districtRep(district: any): Legislator {
    const { districtId } = district;
    return this.houseReps.find(r => r.district === districtId);
  }

  private districtParty(district: any): string {
    const rep = this.districtRep(district);
    return rep && rep.party;
  }

  public party(district: any): string {
    return (this.districtParty(district) || '').toLowerCase();
  }
}
