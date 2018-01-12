import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { DataModule } from '../data/data.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MapViewComponent } from '../map/map-view.component';
import { StateDetailComponent } from '../state-detail/state-detail.component';
import { StateMapComponent } from '../state-map/state-map.component';
import { RepDetailComponent } from '../rep-detail/rep-detail.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    DataModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    MapViewComponent,
    StateDetailComponent,
    StateMapComponent,
    RepDetailComponent,
  ],
  providers: [
  ]
})
export class HomeModule { }
