import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ResultOfQueryWithParams } from 'src/app/model-protected/ResultOfQueryWithParams';
import { Utils, deepCopy } from '../util/utils';
import { AnalysisResult } from '../model/AnalysisResult';
import { InfectiousStatus } from '../model/InfectiousStatus';
import { Patient } from '../model/Patient';
import { OutbreakUnitAsso } from '../model/OutbreakUnitAsso';
import { ContactExposure } from '../model/ContactExposure';

@Injectable({
  providedIn: 'root'
})
export class ContactExposureService {
  
  private apiURL = environment.apiURL + '/contact-exposure';  // URL to web api

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

  simulateContactExposures(
    asso:OutbreakUnitAsso
  ): Observable<ContactExposure[]> {
    
    const url = this.apiURL + "/simulate-contact-exposures";
    
    return this.http.post<any[]>(
      url, 
      {
        "outbreakUnitAsso":asso
      }
    )
    .pipe(map(res => { 
      return this.fromJSONArrayToContactExposureArray(res);
    })) 
    .pipe(
      catchError(this.errorHandlerService.handleError(`simulateContactExposures()`, null))
    );
  }

  generateContactExposuresAndInfectiousStatuses(
    asso:OutbreakUnitAsso
  ): Observable<boolean> {
    
    const url = this.apiURL + "/generate-contact-exposures-and-infectious-statuses";
    
    return this.http.post<any[]>(
      url, 
      {
        "outbreakUnitAsso":asso
      }
    )
    .pipe(
      catchError(this.errorHandlerService.handleError(`generateContactExposuresAndInfectiousStatuses()`, null))
    );
  }

  fromJSONArrayToContactExposureArray(array: Array<Object>): ContactExposure[] {
    let res = array.map(res => new ContactExposure(res));    
    return res
  } 
}
