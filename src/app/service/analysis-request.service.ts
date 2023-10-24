import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ResultOfQueryWithParams } from 'src/app/model-protected/ResultOfQueryWithParams';
import { Utils, deepCopy } from '../util/utils';
import { Outbreak } from '../model/Outbreak';
import { InfectiousStatus } from '../model/InfectiousStatus';
import { OutbreakUnitAsso } from '../model/OutbreakUnitAsso';
import { OUTBREAK_CRITICITY } from '../enum/OUTBREAK_CRITICITY';
import { EventRequiringAttention } from '../model/EventRequiringAttention';
import { OutbreakInfectiousStatusAsso } from '../model/OutbreakInfectiousStatusAsso';
import { AnalysisRequest } from '../model/AnalysisRequest';

@Injectable({
  providedIn: 'root'
})
export class AnalysisRequestService {


  private apiURL = environment.apiURL + '/analysis-request';  // URL to web api

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }


  save(
    analysisRequest:AnalysisRequest
  ): Observable<AnalysisRequest|null> {

    const url = this.apiURL + "/save";

    return this.http.post<any>(
      url,
      analysisRequest
    )
    .pipe(map(res => {
      if (res != null) {
        return new AnalysisRequest(res);
      } else {
        return null;
      }
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`save()`, null))
    );
  }


  getAnalysesRequestsForListing(queryParams:any): Observable<ResultOfQueryWithParams|null> {
    const url = this.apiURL + "/listing";

    var args = deepCopy(queryParams);

    // Force the dates without time to UTC
    var colBirthDate = args.cols.filter(x => x.field == "birthdate")[0] ;
    colBirthDate.filterValue = Utils.forceDateToUTC(colBirthDate.filterValue);

    return this.http.post<ResultOfQueryWithParams>(url,
                                                   JSON.stringify(args))
    .pipe(map(res => {
      return new ResultOfQueryWithParams(res);
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`getAnalysesRequestsForListing()`, null))
    );
  }

  getAnalysesRequestsForListingAsXLSX(queryParams:any): Observable<Blob> {
    const url = this.apiURL + "/listing-as-xlsx";

    var args = deepCopy(queryParams);

    // Force the dates without time to UTC
    var colBirthDate = args.cols.filter(x => x.field == "birthdate")[0] ;
    colBirthDate.filterValue = Utils.forceDateToUTC(colBirthDate.filterValue);

    return this.http.post<ResultOfQueryWithParams>(
      url,
      JSON.stringify(args),
      {responseType: 'blob' as 'json'}
    )
    .pipe(
    catchError(this.errorHandlerService.handleError(`getAnalysesRequestsForListing()`, null))
    );
  }

}
