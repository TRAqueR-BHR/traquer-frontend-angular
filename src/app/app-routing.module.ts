import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuardService} from 'src/app/service/auth-guard-service.service';
import { UserDetailsComponent } from './module/appuser/component/user-details/user-details.component';
import { HomePageComponent } from './page/home-page/home-page.component';
import { LoginComponent } from './page/login/login.component';
import { PatientPageComponent } from './page/patient-page/patient-page.component';
import { UserDetailsPageComponent } from './page/user-details-page/user-details-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/:id', component: UserDetailsPageComponent, canActivate: [AuthGuardService] },
  { path: 'patient/:id', component: PatientPageComponent, canActivate: [AuthGuardService] },
  { path: '', component: HomePageComponent, canActivate: [AuthGuardService] },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
