import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { ROLE_CODE_NAME } from 'src/app/module/appuser/enum/ROLE_CODE_NAME';

/**
 * http://jasonwatmore.com/post/2016/08/16/angular-2-jwt-authentication-example-tutorial
 */
@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router,
        private authenticationService:AuthenticationService) { }
 
    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot) {        

        console.log(route);
        console.log(state);        
        
        // Not logged in so redirect to login page
        if (!localStorage.getItem(environment.jwt_name)) {
            this.redirectToLoginPage();
            return false;
        }
        
        // No restriction on '/'
        if (route.url.length == 0) {
            return true;
        }

        // Add restrictions here
        // ...
        
        return true;                
    }

    redirectToLoginPage() {
        console.log("!!!redirectToLoginPage");
        this.router.navigate(['/login']);
    }

}

