import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

// Modules
import { MaterialModule } from './material.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { DataModule } from './data/data.module';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NationMapComponent } from './nation-map/nation-map.component';
import { StateDetailComponent } from './state-detail/state-detail.component';
import { StateMapComponent } from './state-map/state-map.component';
import { RepDetailComponent } from './rep-detail/rep-detail.component';
import { StateListComponent } from './state-list/state-list.component';

// Services
import { RegionFeatureResolver } from './region-feature-resolver.service';
import { RegionRepsResolver } from './region-reps-resolver.service';
import { NationFeaturesResolver } from './nation-features-resolver.service';
import { CongressResolver } from './congress-resolver.service';
import { RepResolver } from './rep-resolver.service';
import { RepStatusService } from './rep-status.service';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    DataModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    NationMapComponent,
    StateDetailComponent,
    StateMapComponent,
    RepDetailComponent,
    StateListComponent,
  ],
  providers: [
    NationFeaturesResolver,
    CongressResolver,
    RegionFeatureResolver,
    RegionRepsResolver,
    RepResolver,
    RepStatusService,
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }
