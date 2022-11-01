import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { HttpClientModule, HTTP_INTERCEPTORS }    from '@angular/common/http';

import {FullCalendarModule} from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import listPlugin from '@fullcalendar/list'; // a plugin!
import frLocale from '@fullcalendar/core/locales/fr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CheckboxModule } from 'primeng/checkbox';
import {StyleClassModule } from 'primeng/styleclass';
import {KnobModule} from 'primeng/knob';
import { InputTextModule } from 'primeng/inputtext'; 
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple'; 
import {ToastModule} from 'primeng/toast';
import {MenuModule} from 'primeng/menu';
import {MenuItem,PrimeIcons} from 'primeng/api';
import {MegaMenuItem} from 'primeng/api';  //required when using MegaMenu
import {MenubarModule} from 'primeng/menubar';
import { TableModule } from "primeng/table";
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {SplitButtonModule} from 'primeng/splitbutton';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { TranslationModule } from './module/translation/translation.module';
import { TranslationService } from './module/translation/service/translation.service';
import { AppuserModule } from './module/appuser/appuser.module';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { Spe3dlabUtilsModule } from './module/spe3dlab-utils/spe3dlab-utils.module';
import { FrontendVersionModule } from './module/frontend-version/frontend-version.module';

import { AuthGuardService } from './service/auth-guard-service.service';
import { ErrorHandlerService } from './service/error-handler.service';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { DynamicDialogModule, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AuthInterceptor} from './AuthInterceptor';

import { MainMenuComponent } from './component/main-menu/main-menu.component';
import { ListingInfectiousStatusComponent } from './component/listing-infectious-status/listing-infectious-status.component';
import { HomePageComponent } from './page/home-page/home-page.component';
import { LoginComponent } from './page/login/login.component';
import { OtherTranslationsComponent } from './component/other-translations/other-translations.component';
import { UserDetailsPageComponent } from './page/user-details-page/user-details-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfectiousStatusHistoryComponent } from './component/infectious-status-history/infectious-status-history.component';
import { PatientPageComponent } from './page/patient-page/patient-page.component';
import { CalendarPageComponent } from './page/calendar-page/calendar-page.component';
import { CalendarComponent } from './calendar/calendar.component';
import { InfectiousStatusExplanationComponent } from './component/infectious-status-explanation/infectious-status-explanation.component';
import { ResponsesToEventComponent } from './component/responses-to-event/responses-to-event.component';
import { ListboxModule } from 'primeng/listbox';
import { OutbreakEditComponent } from './component/outbreak/outbreak-edit/outbreak-edit.component';
import { OutbreakConfigUnitAssoComponent } from './component/outbreak/outbreak-config-unit-asso/outbreak-config-unit-asso.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { PatientAnalysesComponent } from './component/analysis/patient-analyses/patient-analyses.component';

// References: - https://devblog.dymel.pl/2017/10/17/angular-preload/
//             - https://www.tektutorialshub.com/angular/angular-how-to-use-app-initializer/
export function translationServiceFactory(translationService: TranslationService) {
  return () => translationService.loadTranslations();
}

// The user maybe reloading the page, in which case we want to load the roles from the token.
// If the jwt has been invalidated or deleted the user will be kicked out, no risk.
export function initializeRolesFactory(authenticationService: AuthenticationService) {
  return () => authenticationService.initializeRoles();
}

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin,
  listPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageComponent,
    MainMenuComponent,
    ListingInfectiousStatusComponent,
    OtherTranslationsComponent,
    UserDetailsPageComponent,
    InfectiousStatusHistoryComponent,
    PatientPageComponent,
    CalendarPageComponent,
    CalendarComponent,
    InfectiousStatusExplanationComponent,
    ResponsesToEventComponent,
    OutbreakEditComponent,
    OutbreakConfigUnitAssoComponent,
    PatientAnalysesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
    FontAwesomeModule,
    
    // PrimeNG
    CheckboxModule,
    StyleClassModule,
    KnobModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    DynamicDialogModule,
    ToastModule,
    MenuModule,
    MenubarModule,
    TableModule,
    MultiSelectModule,
    DropdownModule,
    SplitButtonModule,
    ListboxModule,
    InputTextareaModule,
    SelectButtonModule,
    CalendarModule,

    // Spe3dlab modules (needed for pipes)
    Spe3dlabUtilsModule,
    TranslationModule,
    FrontendVersionModule,
    AppuserModule,

    // FullCalendar
    FullCalendarModule,

    
  ],
  providers: [ErrorHandlerService,
              // AuthenticationService,
              AuthGuardService,
              // LoginService,
              MessageService,
              TranslationService,
              ConfirmationService, // For PrimeNG confirmation dialog
              DynamicDialogRef, DynamicDialogConfig,
              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
              { provide: APP_INITIALIZER, useFactory: translationServiceFactory, deps: [TranslationService], multi: true },
              { provide: APP_INITIALIZER, useFactory: initializeRolesFactory, deps: [AuthenticationService], multi: true }
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
