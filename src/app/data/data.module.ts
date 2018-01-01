import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { BackendService } from './backend.service';
import { DataStateService } from './data-state.service';
import { StaticDataService } from './static-data.service';
import { CongressService } from './congress.service';
import { UsaGeographyService } from './usa-geography.service';



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
    UsaGeographyService
  ]
})
export class DataModule { }
