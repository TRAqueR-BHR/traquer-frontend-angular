import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppuserService } from '../../service/app-user.service';
import { Appuser } from 'src/app/module/appuser/model/Appuser';
import { ProcessingService } from 'src/app/service/processing.service';
import { AuthenticationService } from '../../service/authentication.service';
import { ROLE_CODE_NAME } from '../../enum/ROLE_CODE_NAME';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  appuser:Appuser;  
  canDisplayCryptPwdWidget = true;

  constructor(private route: ActivatedRoute,
              private appUserService: AppuserService,
              private processingService:ProcessingService,
              private authenticationService:AuthenticationService) {
    
  }

  ngOnInit() {

    // Angular does not recreate the component if the route is the same ('/user/new' and '/user/33434-4234-3242' are the same)
    // We need to oberve the route params
    // References: https://discourse.nativescript.org/t/force-reloading-page-when-navigate-to-same-route-with-different-params/1743/2
    //             https://stackoverflow.com/questions/41678356/router-navigate-does-not-call-ngoninit-when-same-page
    this.route.params.subscribe(val => {
      this.processingService.clearProcessesList("UserDetailsComponent.route.params.subscribe()");
      this.getAppuserFromParam();
    });

    
  }

  updateDisplayBooleans() {
    console.log(this.authenticationService.hasRole(ROLE_CODE_NAME.healthcare_professional,
      this.appuser));
    if (this.authenticationService.hasRole(ROLE_CODE_NAME.healthcare_professional,
                                           this.appuser)) {
        this.canDisplayCryptPwdWidget = true;
       
    }
  }
  
  getAppuserFromParam(): void {    
    const id = this.route.snapshot.paramMap.get('id')!;   
    this.processingService.blockUI("UserDetailsComponent.getAppuserFromParam");
    // Either create a new user or consult an existing one
    if (id == "new") {
      this.processingService.unblockUI("UserDetailsComponent.getAppuserFromParam()");
      this.appuser = new Appuser({});
      this.updateDisplayBooleans();
    }  else {
      this.appUserService.getAppuser(id).subscribe(res => {            
        this.processingService.unblockUI("UserDetailsComponent.getAppuserFromParam()");
        if (res != null) {
          this.appuser = res;     
          this.updateDisplayBooleans(); 
          console.log(this.appuser);
        }        
      });
    }    
  }

}
