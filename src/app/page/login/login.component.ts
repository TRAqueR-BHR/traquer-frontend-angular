import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { Utils } from 'src/app/util/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  value: number = 0;

  model: any = {username: "", password: ""};

  processing = false;

  constructor(private authenticationService:AuthenticationService,
              private router: Router,) { }

  ngOnInit(): void {
    if (environment.prefillLoginForm) {
      this.model = {username: "psaliou", password: "test5678"}
    }
    this.authenticationService.logout();
  }

  login(evt) {
    console.log(evt);
    this.processing = true;
    this.authenticationService.login(
      this.model.username,
      this.model.password
    ).subscribe(res => {

      this.processing = false;

      if (res != null) {
        // this.processingService.unblockUI("LoginComponent.login");

        this.router.navigate(['/']);
      }
      else {
          // login failed
          // this.error = 'Le login ou mot de passe est incorrect';
          // this.processingService.unblockUI("LoginComponent.login");
      }
    })
  }


}
