import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ResultOfQueryWithParams } from 'src/app/model-protected/ResultOfQueryWithParams';
import { Utils, deepCopy } from '../util/utils';
import { InfectiousStatus } from '../model/InfectiousStatus';
import { AuthenticationService } from '../module/appuser/service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class InfectiousStatusService {

  private apiURL = environment.apiURL + '/infectious-status';  // URL to web api

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private authenticationService:AuthenticationService
  ) { }

  getInfectiousStatusForListing(queryParams:any): Observable<ResultOfQueryWithParams|null> {

    console.log(this.authenticationService.isScrambleMode());

    const url = this.apiURL + "/listing";

    var args = deepCopy(queryParams);

    // Force the dates without time to UTC
    var colBirthDate = args.cols.filter(x => x.field == "birthdate")[0] ;
    colBirthDate.filterValue = Utils.forceDateToUTC(colBirthDate.filterValue);

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<ResultOfQueryWithParams>(url,
                                                   JSON.stringify(args))
    .pipe(map(res => {
      let resultOfQuery = new ResultOfQueryWithParams(res);

      // Scramble name if needed
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
    catchError(this.errorHandlerService.handleError(`getInfectiousStatusForListing()`, null))
    );
  }

  geInfectiousStatusFromInfectiousStatusFilter(
    infectiousStatus:InfectiousStatus,
    includeComplexProperties:boolean
  ): Observable<InfectiousStatus[]> {

    const url = this.apiURL + "/get-infectious-status-from-infectious-status-filter";

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url,
      {
        "infectiousStatus":infectiousStatus,
        "includeComplexProperties":includeComplexProperties
      }
    )
    .pipe(map(res => {
      return this.fromJSONArrayToInfectiousStatusArray(res);
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`geInfectiousStatusFromInfectiousStatusFilter()`, null))
    );
  }

  upsert(infectiousStatus:InfectiousStatus) {

    const url = this.apiURL + "/upsert";

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url,
      infectiousStatus
    )
    .pipe(map(res => {
      if (res != null) {
        return new InfectiousStatus(res);
      } else {
        return null;
      }
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`InfectiousStatusService.update()`, null))
    );

  }

  delete(infectiousStatus:InfectiousStatus) {

    const url = this.apiURL + "/delete";

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url,
      infectiousStatus
    )
    .pipe(map(res => {
      if (res != null) {
        return new InfectiousStatus(res);
      } else {
        return null;
      }
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`InfectiousStatusService.delete()`, null))
    );

  }

  updateVectorPropertyOutbreakInfectiousStatusAssoes(infectiousStatus:InfectiousStatus) {

    const url = this.apiURL + "/update-vector-property-outbreak-infectious-status-assoes";

    return this.http.post<any>(
      url,
      infectiousStatus
    )
    .pipe(map(res => {
      if (res != null) {
        return new InfectiousStatus(res);
      } else {
        return null;
      }
    }))
    .pipe(
      catchError(
        this.errorHandlerService.handleError(
          `InfectiousStatusService.updateVectorPropertyOutbreakInfectiousStatusAssoes()`, null
        )
      )
    );

  }

  fromJSONArrayToInfectiousStatusArray(array: Array<Object>): InfectiousStatus[] {
    let res = array.map(res => new InfectiousStatus(res));
    return res
  }

}
