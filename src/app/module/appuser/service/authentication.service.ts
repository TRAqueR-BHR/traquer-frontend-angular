import { Injectable } from '@angular/core';
import { Appuser } from '../model/Appuser';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/service/error-handler.service';
import { of, Observable } from 'rxjs';
import { catchError, map, tap, filter } from 'rxjs/operators';
import { ROLE_CODE_NAME } from '../enum/ROLE_CODE_NAME';
import { Router } from '@angular/router';
import { Utils } from 'src/app/util/utils';


// LoginService and AuthenticationService are two separate services because 
//   we need AuthenticationService in APP_INITIALIZER (see app.module) 
//   and ErrorHandlerService creates a cyclic exception
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser:Appuser;
  currentUserRoles:string[] = [];
  private apiURL = environment.apiURL + 'authenticate';  // URL to web api

  constructor(private http: HttpClient,
              // private router: Router,
              // private errorHandlerService:ErrorHandlerService // WARNING: DO NOT try to use ErrorHandlerService here,
                                                                //             it is not possible because authentication 
                                                                //             is initialized ay application startup.
                                                                //   TODO: Try (again) to add ErrorHandlerService at startup
              ) {
    console.log("### AuthenticationService.constructor ###");
  }

  getNameOfDatasetPasswordHeaderForHttpRequest() {

  }
  
  parseJwt (token):Object {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    var res:Object = JSON.parse(window.atob(base64));
    // console.log(res);
    return res;
  }

  // This function works either on the current user or on a different user.
  // In the former case we use the JWT  ; in the latter we use the instance
  //   of Appuser passed in argument.
  // DO NOT USE the latter when checking current user roles.
  hasRole(roleCodeName:string | ROLE_CODE_NAME, _user:Appuser|null = null):boolean {

    // Handle the case when we get a ROLE_CODE_NAME as argument
    if (typeof roleCodeName !== "string" ) {
      roleCodeName = ROLE_CODE_NAME[roleCodeName];
    }

    // Use JWT if no Appuser is given
    if (_user == null) {
      
      if (this.currentUserRoles.length == 0){
          this.initializeRoles();
      }
      if (this.currentUserRoles.indexOf(roleCodeName) > -1) {
        return true;
      } else {
        return false;
      }
      
    } else {
      var allRolesNames:string[] = _user.allRoles.map(x => ROLE_CODE_NAME[x.codeName]);
      if (allRolesNames.includes(roleCodeName)) {
        return true;
      } else {
        return false;
      }
    }
  }

  getCryptPwd():string|null {
    return localStorage.getItem(Utils.getCryptPwdLocalStorageKey());
  }

  initializeRoles() {
    console.log("DEBUG initializeRoles");

    // Important check, DO NOT REMOVE!
    // This function is called at the initialization of the app, the jwt may not exist yet    
    if (this.getJWT() != null) {
      console.log(`DEBUG initializeRoles - this.getJWT() != null`);
      this.currentUserRoles = this.parseJwt(this.getJWT())['roles'];   
      console.log(this.currentUserRoles);
    }
    
  }

  public isLoggedIn() {
      return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration!);
      return moment(expiresAt);
  }

  setJWT(jwt:string) {
    localStorage.setItem(environment.jwt_name, jwt);
  }

  getAppuserIdFromJWT() {
    return this.parseJwt(this.getJWT())['userId'];    
  }

  getAppuserFirstnameFromJWT() {
    return this.parseJwt(this.getJWT())['firstname'];    
  }

  getJWT() {
    return localStorage.getItem(environment.jwt_name);    
  }

  login(login: string, password: string): Observable<Appuser> {

    var url =  this.apiURL;
   
    return this.http.post<Appuser>(url, 
                                   JSON.stringify({login, password}), 
//                                        ,{headers: this.headers}
                                   )
        // Set the current user before returning it
        .pipe(tap(res => {
            this.currentUser = new Appuser(res);
            this.setJWT(res.jwt);
            this.initializeRoles();
            //  console.dir(this.currentUser);
            })) 
        .pipe(
          catchError(this.handleLoginError<any>(`login`,null))
        )
      //  .pipe(map(res => {
      //      return res;
      //  }))                        
      // .shareReplay()
                        ;
  }

  logout() {
    localStorage.removeItem(environment.jwt_name);
    localStorage.removeItem("expires_at");
  }


  public handleLoginError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log("Could not login");
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
