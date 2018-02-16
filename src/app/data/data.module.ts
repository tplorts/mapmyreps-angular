import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@app/core/core.module';
import { BackendService } from './backend.service';
import { DataStateService } from './data-state.service';
import { StaticDataService } from './static-data.service';
import { CongressService } from './congress.service';
import { UsaGeographyService } from './usa-geography.service';
import { CongressionalDistrictsService } from './congressional-districts.service';
import { D3GeoStatePlaneService } from './d3-geo-state-plane.service';
import { UsaRegionsService } from './usa-regions.service';
import { PoliticalStatsService } from './political-stats.service';



@NgModule({
  imports: [
    CommonModule,
    CoreModule,
  ],
  declarations: [],
  providers: [
    BackendService,
    DataStateService,
    StaticDataService,
    CongressService,
    UsaGeographyService,
    CongressionalDistrictsService,
    D3GeoStatePlaneService,
    UsaRegionsService,
    PoliticalStatsService,
  ]
})
export class DataModule { }
