import { Injectable } from '@angular/core';
import { Appuser } from '../model/Appuser';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/service/error-handler.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Utils } from 'src/app/util/utils';

@Injectable({
  providedIn: 'root'
})
export class AppuserService {

  private apiURL = environment.apiURL + 'appuser';  // URL to web api

  constructor(private http: HttpClient,
              private errorHandlerService: ErrorHandlerService) { }

  getAppuser(id:string): Observable<Appuser|null> {
    
    const url = this.apiURL + "/retrieve-user-from-id";
    return this.http.post<Appuser>(url,
                                JSON.stringify({"appuser.id": id}))    
    .pipe(map(res => { 
      console.log(res);
      var appuser =  new Appuser(res);
      return appuser;
    }))  
    .pipe(
      catchError(this.errorHandlerService.handleError(`getAppuser(${id})`, null))
    );
  }


  getAllUsers(): Observable<any[]|null> {
    const url = this.apiURL + "/get-all-users";
    return this.http.get<any[]>(url)    
    .pipe(map( res =>             
      Utils.convertPlainDataframe(res)
      ))  
    .pipe(
      catchError(this.errorHandlerService.handleError(`getAllUsers()`, null))
    );
  }


  saveAppuser(appUser:Appuser): Observable<Appuser|null>{

    console.log(appUser);
    const url = this.apiURL + "/save";
    return this.http.post<Appuser>(url,
                                JSON.stringify(appUser))    
    .pipe(map(res => {        
      return new Appuser(res);
    }))  
    .pipe(
      catchError(this.errorHandlerService.handleError(`saveAppuser(${appUser.id})`, null))
    );
  }
}
