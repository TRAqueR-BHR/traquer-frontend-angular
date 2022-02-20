import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FrontendVersionService } from '../../service/frontend-version.service';
import { TranslationService } from 'src/app/module/translation/service/translation.service';

@Component({
  selector: 'app-app-version',
  templateUrl: './app-version.component.html',
  styleUrls: ['./app-version.component.scss']
})
export class AppVersionComponent implements OnInit {

  doSomethingSubscription;

  checkVersionSubscription;
  contentForReloadAppDialog:string;
  displayReloadAppDialog:boolean = false;
  currentVersionName:string;

  constructor(private frontendVersionService:FrontendVersionService,
              private translationService:TranslationService) { }


  ngOnInit() {
    // Check the version a first time
    this.checkVersion();
    this.startRepetingActions();
    this.currentVersionName = environment.frontEndVersion;
  }

  ngOnDestroy() {
    this.checkVersionSubscription.unsubscribe();
  }

  startRepetingActions(){
    this.checkVersionSubscription = interval(1000 * environment.numberOfSecondsBetweenChecksOfVersion).subscribe(x => {
      this.checkVersion();
    });

    this.doSomethingSubscription = interval(1000 * 3).subscribe(x => {
      // this.sayHello();
    });
  }

  checkVersion() {
    console.log("Check version");
    this.frontendVersionService.getCurrentFrontendVersion().subscribe(res => {
      if (res!=null) {
        if (res.forceReloadIfDifferentVersion === true && res.name != environment.frontEndVersion) {
          this.contentForReloadAppDialog = this.translationService.getTranslation("a_new_version_is_available_long");
          this.contentForReloadAppDialog = this.contentForReloadAppDialog.replace("#VERSION_NAME#",res.name);      
          this.displayReloadAppDialog = true;
        }
      }
    });
  }

  reloadApp() {
    window.location.reload();
  }



}

