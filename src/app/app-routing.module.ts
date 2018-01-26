import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  UrlSegment,
  UrlSegmentGroup,
  UrlMatchResult
} from '@angular/router';

import { Logger } from './core/logger.service';
import { Route } from './core/route.service';
import { UsaRegionsService } from './data/usa-regions.service';
import { RegionFeatureResolver } from './region-feature-resolver.service';
import { RegionRepsResolver } from './region-reps-resolver.service';
import { NationFeaturesResolver } from './nation-features-resolver.service';
import { CongressResolver } from './congress-resolver.service';
import { RepResolver } from './rep-resolver.service';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { StateDetailComponent } from './state-detail/state-detail.component';
import { RepDetailComponent } from './rep-detail/rep-detail.component';


const log = new Logger('Routing');



export function stateMatcher(segments: UrlSegment[]): UrlMatchResult {
  if (segments.length > 0 && UsaRegionsService.isPostal(segments[0].path)) {
    return { consumed: [segments[0]] };
  }
  return null;
}



const routes: Routes = Route.withShell([
  {
    path: 'about',
    component: AboutComponent,
  },

  {
    path: '',
    component: HomeComponent,
    resolve: {
      geography: NationFeaturesResolver,
      congress: CongressResolver,
    },
    children: [
      {
        matcher: stateMatcher,
        component: StateDetailComponent,
        resolve: {
          regionFeature: RegionFeatureResolver,
          regionReps: RegionRepsResolver,
        },
        children: [
          {
            path: ':repSegment',
            component: RepDetailComponent,
            resolve: {
              rep: RepResolver,
            },
          }
        ],
      },
    ],
  },

  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
]);



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
