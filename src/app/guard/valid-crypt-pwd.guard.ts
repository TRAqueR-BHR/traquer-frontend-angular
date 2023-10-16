import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ValidCryptPwdGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService:AuthenticationService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Not logged in so redirect to login page
    if (!localStorage.getItem(environment.cryptPwdLocalStorageKey)) {
      this.redirectToAppuserSettings();
      return false;
    }

    return true;
  }

  redirectToAppuserSettings() {
    this.router.navigate(['/user',this.authenticationService.getAppuserIdFromJWT()]);
}

}
