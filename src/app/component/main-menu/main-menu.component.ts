import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { SimulateProcessingAtPointInTimeComponent } from '../simulate-processing-at-point-in-time/simulate-processing-at-point-in-time.component';
import { ROLE_CODE_NAME } from 'src/app/enum/ROLE_CODE_NAME';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  providers: [DialogService]
})
export class MainMenuComponent implements OnInit {

  items: MenuItem[];
  linkToUserAccount:string;

  constructor(
    private authenticationService: AuthenticationService,
    public translationService: TranslationService,
    public dialogService: DialogService,
  ) { }

  ngOnInit(): void {

    this.linkToUserAccount = "/user/" + this.authenticationService.getAppuserIdFromJWT();

    this.items = [
      {
        label: this.translationService.getTranslation('home_page'),
        items:[
          {
            label: this.translationService.getTranslation('home_page'),
            icon: 'pi pi-home',
            routerLink: ['/'],
          },
          {
            label: this.translationService.getTranslation('analyses'),
            icon: 'fa fa-solid fa-flask',
            routerLink: ['/analyses'],
          },
          {
            label: this.translationService.getTranslation('analyses_requests'),
            icon: 'fa fa-solid fa-flask',
            routerLink: ['/analyses-requests'],
          },
          {
            label: this.translationService.getTranslation('stays'),
            icon: 'fa fa-solid fa-bed',
            routerLink: ['/stays'],
          },
        ]
      },
    ];

    //
    // Advanced functions
    //
    let advancedFunctionsItems:any[] = [];
    advancedFunctionsItems.push({
        label: this.translationService.getTranslation('simulate_processing_at_given_date'),
        icon: 'far fa-clock',
        command: () => {
          this.openSimulateProcessingAtPointInTime();
        }
    });
    advancedFunctionsItems.push({
      label: this.translationService.getTranslation('advanced_functions'),
      icon: 'fas fa-play',
      routerLink: ["/exposed-function"],
    });

    this.items.push({
      // label: this.translationService.getTranslation('i18n@@settings'),
      label: this.translationService.getTranslation("advanced_functions"),
      items:advancedFunctionsItems
    });

    //
    // Settings
    //
    let settingsItems:any[] = [];
    settingsItems.push({
        label: this.translationService.getTranslation('my_account'),
        icon: 'far fa-address-card',
        routerLink: [this.linkToUserAccount],
    });
    if (this.authenticationService.hasRole(ROLE_CODE_NAME.can_modify_user)) {
      settingsItems.push({
        label: this.translationService.getTranslation('users'),
        icon: 'far fa-address-card',
        routerLink: ["/users"],
      });
    }
    settingsItems.push({
      label: this.translationService.getTranslation('logout'),
      icon: 'fas fa-sign-out-alt',
      routerLink: ['/login'],
    });

    this.items.push({
      // label: this.translationService.getTranslation('i18n@@settings'),
      label: this.translationService.getTranslation("settings"),
      items:settingsItems
    });
  }

  openSimulateProcessingAtPointInTime(){

    const ref = this.dialogService.open(SimulateProcessingAtPointInTimeComponent, {
      data: {
        "new": true
      },
      header: this.translationService.getTranslation("simulate_processing_at_given_date"),
      width: '85%'
    });

    ref.onClose.subscribe(res=> {
      window.location.reload();
    })

  }

}
