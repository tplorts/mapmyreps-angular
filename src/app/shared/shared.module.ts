import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';
import { LoaderComponent } from './loader/loader.component';
import { NumbersOnlyPipe } from './numbers-only.pipe';
import { DistrictOrdinalPipe } from './district-ordinal.pipe';
import { GeolocateService } from './geolocate.service';
import { IconBackToMapComponent } from './icons/icon-back-to-map/icon-back-to-map.component';

@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule
  ],
  declarations: [
    LoaderComponent,
    NumbersOnlyPipe,
    DistrictOrdinalPipe,
    IconBackToMapComponent,
  ],
  exports: [
    LoaderComponent,
    NumbersOnlyPipe,
    DistrictOrdinalPipe,
    IconBackToMapComponent,
  ],
  providers: [
    GeolocateService,
  ],
})
export class SharedModule { }
