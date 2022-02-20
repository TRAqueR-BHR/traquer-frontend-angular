import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { TranslationService } from 'src/app/module/translation/service/translation.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  items: MenuItem[];
  linkToUserAccount:string;

  constructor(private authenticationService: AuthenticationService,
              public translationService: TranslationService,) { }

  ngOnInit(): void {

    this.linkToUserAccount = "/user/" + this.authenticationService.getAppuserIdFromJWT();

    this.items = [
      {
        label: 'Home',
        items:[ {
            label: 'Home',
            icon: 'pi pi-home',
            routerLink: ['/'],        
          }
        ]
      },
    ];

    //
    // Settings
    //
    let settingsItems:any[] = [];
    settingsItems.push({
        label: this.translationService.getTranslation('i18n@@my_account'),
        icon: 'far fa-address-card',
        routerLink: [this.linkToUserAccount],            
    });

    this.items.push({
      // label: this.translationService.getTranslation('i18n@@settings'),
      label: this.translationService.getTranslation("settings"),
      items:settingsItems            
    });   

  }

}
