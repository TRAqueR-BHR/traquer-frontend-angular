import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuardService} from 'src/app/service/auth-guard-service.service';
import { PatientAnalysesComponent } from './component/analysis/patient-analyses/patient-analyses.component';
import { OutbreakEditComponent } from './component/outbreak/outbreak-edit/outbreak-edit.component';
import { ResponsesToEventComponent } from './component/responses-to-event/responses-to-event.component';
import { UserDetailsComponent } from './module/appuser/component/user-details/user-details.component';
import { CalendarPageComponent } from './page/calendar-page/calendar-page.component';
import { HomePageComponent } from './page/home-page/home-page.component';
import { LoginComponent } from './page/login/login.component';
import { PatientPageComponent } from './page/patient-page/patient-page.component';
import { UserDetailsPageComponent } from './page/user-details-page/user-details-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/:id', component: UserDetailsPageComponent, canActivate: [AuthGuardService] },
  { path: 'patient/:id', component: PatientPageComponent, canActivate: [AuthGuardService] },
  { path: 'calendar', component: CalendarPageComponent, canActivate: [AuthGuardService] },

  // Debugging components
  { path: 'debug1/responses-to-event/:eventId', component: ResponsesToEventComponent, canActivate: [AuthGuardService] },
  { path: 'debug2/outbreak-edit/:outbreakId', component: OutbreakEditComponent, canActivate: [AuthGuardService] },
  { path: 'debug3/patient-analyses/:patientId', component: PatientAnalysesComponent, canActivate: [AuthGuardService] },

  { path: '', component: HomePageComponent, canActivate: [AuthGuardService] },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
