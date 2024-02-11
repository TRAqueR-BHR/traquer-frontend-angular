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
import { AuthenticationService } from '../module/appuser/service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private apiURL = environment.apiURL + '/analysis';  // URL to web api

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private authenticationService:AuthenticationService
  ) { }

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


  upsert(analysisResult:AnalysisResult, analysisRef:string) {

    const url = this.apiURL + "/upsert";

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url,
      {
        analysisResult:analysisResult,
        analysisRef:analysisRef
      }
    )
    .pipe(map(res => {
      if (res != null) {
        return new AnalysisResult(res);
      } else {
        return null;
      }
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`AnalysisService.upsert`, null))
    );

  }

  getAnalysesResultsForListing(queryParams:any): Observable<ResultOfQueryWithParams|null> {
    const url = this.apiURL + "/listing";

    var args = deepCopy(queryParams);

    // Force the dates without time to UTC
    var colBirthDate = args.cols.filter(x => x.field == "birthdate")[0] ;
    colBirthDate.filterValue = Utils.forceDateToUTC(colBirthDate.filterValue);

    return this.http.post<ResultOfQueryWithParams>(url,
                                                   JSON.stringify(args))
    .pipe(map(res => {

      let resultOfQuery = new ResultOfQueryWithParams(res);

      // Scramble patient name if needed
      if (this.authenticationService.isScrambleMode()) {
        resultOfQuery.rows = resultOfQuery.rows.map( x => {
          x["firstname"] = Utils.scrambleString(x["firstname"]);
          x["lastname"] = Utils.scrambleString(x["lastname"]);
          return x;
        });
      }

      return resultOfQuery;
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`getAnalysesResultsForListing()`, null))
    );
  }

  fromJSONArrayToAnalysisArray(array: Array<Object>): AnalysisResult[] {
    let res = array.map(res => new AnalysisResult(res));
    return res
  }
}
