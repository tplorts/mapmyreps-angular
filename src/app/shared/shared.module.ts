import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';
import { LoaderComponent } from './loader/loader.component';
import { NumbersOnlyPipe } from './numbers-only.pipe';

@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule
  ],
  declarations: [
    LoaderComponent,
    NumbersOnlyPipe
  ],
  exports: [
    LoaderComponent,
    NumbersOnlyPipe,
  ]
})
export class SharedModule { }
