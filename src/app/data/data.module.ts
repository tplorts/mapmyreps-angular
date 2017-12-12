import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { BackendService } from './backend.service';
import { LegislatorsService } from './legislators.service';



@NgModule({
  imports: [
    CommonModule,
    CoreModule,
  ],
  declarations: [],
  providers: [
    BackendService,
    LegislatorsService
  ]
})
export class DataModule { }
