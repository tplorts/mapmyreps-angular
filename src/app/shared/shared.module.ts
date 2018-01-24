import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';
import { LoaderComponent } from './loader/loader.component';
import { NumbersOnlyPipe } from './numbers-only.pipe';
import { DistrictOrdinalPipe } from './district-ordinal.pipe';
import { GeolocateService } from './geolocate.service';
import { PreAppLoaderService } from './pre-app-loader.service';



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
  ],
  exports: [
    LoaderComponent,
    NumbersOnlyPipe,
    DistrictOrdinalPipe,
  ],
  providers: [
    GeolocateService,
    PreAppLoaderService,
  ],
})
export class SharedModule { }
