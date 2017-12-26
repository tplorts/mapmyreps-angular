import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeModule } from 'angular-tree-component';

import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material.module';
import { MapViewComponent } from './map-view.component';
import { DataModule } from '../data/data.module';
import { DistrictPipe } from './district.pipe';

@NgModule({
  imports: [
    CommonModule,
    TreeModule,
    CoreModule,
    MaterialModule,
    DataModule,
  ],
  declarations: [
    MapViewComponent,
    DistrictPipe,
  ],
  exports: [
    MapViewComponent,
  ]
})
export class MapModule { }
