import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Utils, deepCopy } from '../util/utils';
import { OutbreakUnitAsso } from '../model/OutbreakUnitAsso';
import { Stay } from '../model/Stay';
import { INFECTIOUS_STATUS_TYPE } from '../enum/INFECTIOUS_STATUS_TYPE';
import { Patient } from '../model/Patient';
import { ResultOfQueryWithParams } from '../model-protected/ResultOfQueryWithParams';
import { EventRequiringAttention } from '../model/EventRequiringAttention';
import { AuthenticationService } from '../module/appuser/service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class StayService {

  private apiURL = environment.apiURL + '/stay';  // URL to web api

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private authenticationService:AuthenticationService
  ) { }

  getCarriersOrContactsStaysForListingFromOutbreakUnitAsso(
    outbreakUnitAsso:OutbreakUnitAsso,
    infectiousStatusType:INFECTIOUS_STATUS_TYPE,
  ): Observable<any[]> {

    const url = this.apiURL + "/get-carriers-or-contacts-stays-from-outbreak-unit-asso";

    return this.http.post<any>(
      url,
      {
        "outbreakUnitAsso":outbreakUnitAsso,
        "infectiousStatusType":infectiousStatusType
      }
    )
    .pipe(map(res => {
      let rows = Utils.convertPlainDataframe(res);

      // Scramble name if needed
      if (this.authenticationService.isScrambleMode()){
        rows = rows.map(x => {
          x["firstname"] = Utils.scrambleString(x["firstname"]);
          x["lastname"] = Utils.scrambleString(x["lastname"]);
          return x;
        })
      }

      return rows;
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`getCarriersStaysFromOutbreakUnitAsso()`, null))
    );
  }


  getPatientHospitalizationsDates(patient:Patient): Observable<any[]> {

    const url = this.apiURL + "/get-patient-hospitalizations-dates";

    return this.http.post<any>(
      url,
      {
        "patient":patient,
      }
    )
    .pipe(map(res => {
      return Utils.convertPlainDataframe(res);
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`getPatientHospitalizationsDates()`, null))
    );
  }

  geStayFromStayFilter(
    stay:Stay,
    includeComplexProperties:boolean
  ): Observable<Stay[]> {

    const url = this.apiURL + "/get-stay-from-stay-filter";

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url,
      {
        "stay":stay,
        "includeComplexProperties":includeComplexProperties
      }
    )
    .pipe(map(res => {
      return this.fromJSONArrayToStayArray(res);
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`geStayFromStayFilter()`, null))
    );
  }

  upsert(stay:Stay) {

    const url = this.apiURL + "/upsert";

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url,
      stay
    )
    .pipe(map(res => {
      if (res != null) {
        return new Stay(res);
      } else {
        return null;
      }
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`StayService.upsert()`, null))
    );

  }

  getStaysForListing(queryParams:any): Observable<ResultOfQueryWithParams|null> {
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
    catchError(this.errorHandlerService.handleError(`getStaysForListing()`, null))
    );
  }

  savePatientIsolationDateFromEventRequiringAttention(
    eventRequiringAttention:EventRequiringAttention,
    isolationTime:Date
  ): Observable<Stay>{
    const url = `${this.apiURL}/save-patient-isolation-date-from-event-requiring-attention`;
    return this.http.post<any>(
      url,
      {
        "event":eventRequiringAttention,
        "isolationTime":isolationTime
      }
    )
    .pipe(map(res => {
      if (res != null) {
        return new Stay(res);
      } else {
        return null;
      }
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`StayService.savePatientIsolationDateFromEventRequiringAttention()`, null))
    );

  }

  deleteIsolationTime(
    stay:Stay
  ): Observable<Stay>{
    const url = `${this.apiURL}/delete-isolation-time`;
    return this.http.post<any>(
      url,
      stay
    )
    .pipe(map(res => {
      if (res != null) {
        return new Stay(res);
      } else {
        return null;
      }
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`StayService.deleteIsolationTime()`, null))
    );

  }


  fromJSONArrayToStayArray(array: Array<Object>): Stay[] {
    let res = array.map(res => new Stay(res));
    return res
  }
}
