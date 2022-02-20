import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
// import {AuthenticationService} from './authentication.service';
import { Router } from '@angular/router';
import {MessageService} from 'primeng/api';
import { ProcessingService } from './processing.service';

@Injectable()
export class ErrorHandlerService {

  constructor(private router: Router,
              private messageService:MessageService,
              private processingService:ProcessingService) { }
  
  
  /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
   public handleError<T> (operation = 'operation', result?: T) {
     return (error: any): Observable<T> => {

      console.log(`typeof error${typeof error}`);

      this.handleErrorCore(error,operation)

       // TODO: better job of transforming error for user consumption
//       this.log(`${operation} failed: ${error.message}`);

       // Let the app keep running by returning an empty result.
       return of(result as T);
     };
   }
   

   
   public handleErrorCore(error,operation) {

    this.processingService.clearProcessesList("ErrorHandlerService.handleErrorCore");
    console.error(error);

    if (error.status === 401 && operation != "login") {
//           this.authenticationService.logout();
        this.router.navigate(["/login"]);
        // console.warn(`Server responded with a 401 (Unauthorized) on operation[${operation}], the user needs to be logged out`);
        console.warn("Server responded with a 401 (Unauthorized) on operation[], the user needs to be logged out");
    } else {
      var detail = error.statusText;
      console.log(detail);
      console.log(error);
      
      if (error.error != null) {
        if (typeof error.error === "string") {
          detail += " " + error.error;
        } else {
          if (error.error.val != null) {
            detail += " " + error.error.val;
          }
          if (error.error.msg != null) {
            detail += " " + error.error.msg;
          } 
          if (error.error.message != null) {
            detail += " " + error.error.message;
          } 
        }       
         
    }
     this.messageService.add({severity:'error', 
                              summary: 'Error', 
                              detail:detail});
    }

  }

}
