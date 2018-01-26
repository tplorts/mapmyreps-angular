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

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { StateDetailComponent } from './state-detail/state-detail.component';

const log = new Logger('Routing');


// TODO: can we use the regions service instance to use isPostal()?
export function stateMatcher(segments: UrlSegment[], group: UrlSegmentGroup, route: Route): UrlMatchResult {
  // const consumed = new Array<UrlSegment>();
  if (segments.length > 0 && UsaRegionsService.PostalExp.test(segments[0].path)) {
    log.debug('state', segments[0].path);
    // consumed.push(segments[0]);
    return { consumed: [segments[0]] };
  }
  return null;
}


const routes: Routes = Route.withShell([
  // Fallback when no prior route is matched
  // { path: '**', redirectTo: '', pathMatch: 'full' }
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        // path: ':statePostal',
        matcher: stateMatcher,
        component: StateDetailComponent,
      },
    ],
  },
]);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
