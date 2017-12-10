import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeModule } from 'angular-tree-component';

import { MaterialModule } from '../material.module';
import { MapViewComponent } from './map-view.component';

@NgModule({
  imports: [
    CommonModule,
    TreeModule,
    MaterialModule,
  ],
  declarations: [
    MapViewComponent,
  ],
  exports: [
    MapViewComponent,
  ]
})
export class MapModule { }
