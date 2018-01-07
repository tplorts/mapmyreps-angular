import { Component, OnInit, Input } from '@angular/core';

import { CongressionalDistrictsService } from '../data/congressional-districts.service';



@Component({
  selector: 'app-state-map',
  templateUrl: './state-map.component.html',
  styleUrls: ['./state-map.component.scss']
})
export class StateMapComponent implements OnInit {

  @Input() state: any;

  public stateMapOptions = {
    width: 256,
    height: 256,
    padding: 32,
  };

  constructor(
    private districts: CongressionalDistrictsService,
  ) {}

  ngOnInit() {
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

  public get districtFeatures(): any[] {
    return this.districts.districtsFor(this.state.abbreviation);
  }

  public get districtsTransform(): string {
    return `translate(200, 100)`;
  }
}
