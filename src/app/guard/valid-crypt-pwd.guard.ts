import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { MasterKeyService } from 'src/app/service/master-key.service';

@Injectable({
  providedIn: 'root'
})
export class ValidCryptPwdGuard  {

  constructor(
    private router: Router,
    private authenticationService:AuthenticationService,
    private masterKeyService:MasterKeyService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // The master key is no longer stored client-side, so ask the server
    //   whether it is currently set before allowing the user through.
    return this.masterKeyService.fetchIsMasterKeySet().pipe(map(isSet => {
      if (!isSet) {
        this.redirectToAppuserSettings();
        return false;
      }
      return true;
    }));
  }

  redirectToAppuserSettings() {
    this.router.navigate(['/user',this.authenticationService.getAppuserIdFromJWT()]);
}

}