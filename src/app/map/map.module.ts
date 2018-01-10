import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material.module';
import { MapViewComponent } from './map-view.component';
import { DataModule } from '../data/data.module';
import { SharedModule } from '../shared/shared.module';
import { DistrictPipe } from './district.pipe';
import { GeolocateService } from './geolocate.service';
import { StateDetailComponent } from '../state-detail/state-detail.component';
import { RepDetailComponent } from '../rep-detail/rep-detail.component';
import { StateMapComponent } from '../state-map/state-map.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MaterialModule,
    DataModule,
    SharedModule,
  ],
  declarations: [
    MapViewComponent,
    DistrictPipe,
    StateDetailComponent,
    RepDetailComponent,
    StateMapComponent,
  ],
  exports: [
    MapViewComponent,
  ],
  providers: [
    GeolocateService,
  ]
})
export class MapModule { }
