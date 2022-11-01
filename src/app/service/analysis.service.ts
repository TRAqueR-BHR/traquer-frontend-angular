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

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private apiURL = environment.apiURL + '/analysis';  // URL to web api

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

  getAnalysesFromPatient(
    patient:Patient
  ): Observable<AnalysisResult[]> {
    
    const url = this.apiURL + "/get-analyses-from-patient";
    
    return this.http.post<any[]>(
      url, 
      {
        "patient":patient
      }
    )
    .pipe(map(res => { 
      return this.fromJSONArrayToAnalysisArray(res);
    })) 
    .pipe(
      catchError(this.errorHandlerService.handleError(`getAnalysesFromPatient()`, null))
    );
  }

  fromJSONArrayToAnalysisArray(array: Array<Object>): AnalysisResult[] {
    let res = array.map(res => new AnalysisResult(res));    
    return res
  } 
}
