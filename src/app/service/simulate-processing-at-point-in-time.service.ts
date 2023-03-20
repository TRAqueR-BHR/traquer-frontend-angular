import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/service/error-handler.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, shareReplay } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class SimulateProcessingAtPointInTimeService {

  public apiURL = environment.apiURL + '/misc';  // URL to web api

  private thumbnailCache = {};

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private domSanitizer: DomSanitizer,
    private authenticationService:AuthenticationService
  ) { }


  resetData():Observable<boolean> {

    const url = this.apiURL + "/reset-data";

    return this.http.post<boolean>(
      url,
      {}
    )
    .pipe(
      catchError(this.errorHandlerService.handleError(`SimulateProcessingAtPointInTimeService.resetData()`, null))
    );

  }

  processNewDataAtGivenTime(processingTime:Date):Observable<boolean> {

    const url = this.apiURL + "/process-newly-integrated-data";

    return this.http.post<boolean>(
      url,
      {processingTime:processingTime}
    )
    .pipe(
      catchError(
        this.errorHandlerService.handleError(
          `SimulateProcessingAtPointInTimeService.processNewDataAtGivenTime()`,
          null
        )
      )
    );

  }


}
