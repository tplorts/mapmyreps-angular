import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { HomeComponent } from './home.component';
import { StateDetailComponent } from '../state-detail/state-detail.component';

const routes: Routes = Route.withShell([
  { path: '', component: HomeComponent },
  { path: ':stateAbbreviation', component: StateDetailComponent },
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
