import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuardService} from 'src/app/service/auth-guard-service.service';
import { AnalysesResultsComponent } from './component/analysis/analyses-results/analyses-results.component';
import { AnalysisResultEditComponent } from './component/analysis/analysis-result-edit/analysis-result-edit.component';
import { PatientAnalysesComponent } from './component/analysis/patient-analyses/patient-analyses.component';
import { AssociateInfectiousStatusToOutbreaksComponent } from './component/infectious-status/associate-infectious-status-to-outbreaks/associate-infectious-status-to-outbreaks.component';
import { InfectiousStatusEditComponent } from './component/infectious-status/infectious-status-edit/infectious-status-edit.component';
import { InfectiousStatusExplanationComponent } from './component/infectious-status/infectious-status-explanation/infectious-status-explanation.component';
import { OutbreakEditComponent } from './component/outbreak/outbreak-edit/outbreak-edit.component';
import { PatientSearchComponent } from './component/patient/patient-search/patient-search.component';
import { ResponsesToEventComponent } from './component/responses-to-event/responses-to-event.component';
import { SimulateProcessingAtPointInTimeComponent } from './component/simulate-processing-at-point-in-time/simulate-processing-at-point-in-time.component';
import { StayEditComponent } from './component/stay/stay-edit/stay-edit.component';
import { StaysComponent } from './component/stay/stays/stays.component';
import { UserDetailsComponent } from './module/appuser/component/user-details/user-details.component';
import { AnalysesPageComponent } from './page/analyses-page/analyses-page.component';
import { CalendarPageComponent } from './page/calendar-page/calendar-page.component';
import { HomePageComponent } from './page/home-page/home-page.component';
import { LoginComponent } from './page/login/login.component';
import { PatientPageComponent } from './page/patient-page/patient-page.component';
import { StaysPageComponent } from './page/stays-page/stays-page.component';
import { UserDetailsPageComponent } from './page/user-details-page/user-details-page.component';
import { UsersPageComponent } from './page/users-page/users-page.component';
import { AnalysisRequestEditComponent } from './component/analysis/analysis-request-edit/analysis-request-edit.component';
import { ExposedFunctionPageComponent } from './page/exposed-function-page/exposed-function-page.component';
import { ValidCryptPwdGuard } from './guard/valid-crypt-pwd.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user/:id', component: UserDetailsPageComponent, canActivate: [AuthGuardService] },
  { path: 'users', component: UsersPageComponent, canActivate: [AuthGuardService] },
  { path: 'patient/:id', component: PatientPageComponent, canActivate: [AuthGuardService] },
  {
    path: 'stays',
    component: StaysPageComponent,
    canActivate: [AuthGuardService, ValidCryptPwdGuard]
  },
  {
    path: 'analyses',
    component: AnalysesPageComponent,
    canActivate: [AuthGuardService, ValidCryptPwdGuard]
  },
  { path: 'calendar', component: CalendarPageComponent, canActivate: [AuthGuardService] },
  { path: 'exposed-function', component: ExposedFunctionPageComponent, canActivate: [AuthGuardService] },


  // Debugging components
  {
    path: 'debug1/responses-to-event/:eventId',
    component: ResponsesToEventComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug2/outbreak-edit/:outbreakId',
    component: OutbreakEditComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug3/patient-analyses/:patientId',
    component: PatientAnalysesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug4/infectious-status-edit/:infectiousStatusId',
    component: InfectiousStatusEditComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug5/infectious-status-explanation/:patientId',
    component: InfectiousStatusExplanationComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug6/associate-infectious-status-to-outbreaks/:infectiousStatusId',
    component: AssociateInfectiousStatusToOutbreaksComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug7/patient-search',
    component: PatientSearchComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug8/infectious-status-edit/:infectiousStatusId',
    component: InfectiousStatusEditComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug9/stay-edit/:stayId',
    component: StayEditComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug10/analysis-result-edit/:analysisResultId',
    component: AnalysisResultEditComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug11/simulate-processing-at-point-in-time',
    component: SimulateProcessingAtPointInTimeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug12/analyses-results-for-listing',
    component: AnalysesResultsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug13/stays-for-listing',
    component: StaysComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'debug14/analysis-request-edit/:analysisRequestId',
    component: AnalysisRequestEditComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    component: HomePageComponent,
    canActivate: [AuthGuardService, ValidCryptPwdGuard]
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
