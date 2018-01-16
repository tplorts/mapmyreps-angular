import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CongressionalDistrictsService } from '../data/congressional-districts.service';
import { Representative } from '../data/congress';



@Component({
  selector: 'app-state-map',
  templateUrl: './state-map.component.pug',
  styleUrls: ['./state-map.component.scss']
})
export class StateMapComponent implements OnInit {

  @Input() state: any;
  @Input() houseReps: Representative[];
  @Input() selectedDistrict: number | null;

  @Output() onSelectDistrict: EventEmitter<number> = new EventEmitter();

  public stateMapOptions = {
    width: 320,
    height: 320,
    padding: 16,
  };

  constructor(
    private districts: CongressionalDistrictsService,
  ) {}

  ngOnInit() {
    this.selectedDistrict = null;
    const { id, abbreviation } = this.state;
    const { width, height, padding } = this.stateMapOptions;
    const p = 2 * padding;
    this.districts.fetchState(id, abbreviation, width - p, height - p);
  }

  public get stateTransform(): string {
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

  public isSelected(district: any): boolean {
    return this.selectedDistrict === district.districtId;
  }

  public selectDistrict(district: any): void {
    this.onSelectDistrict.emit(district.districtId);
  }

  private districtParty(district: any): string {
    const { districtId } = district;
    const rep = this.houseReps.find(r => r.district === districtId);
    return rep && rep.party;
  }

  public party(district: any): string {
    return (this.districtParty(district) || '').toLowerCase();
  }
}
