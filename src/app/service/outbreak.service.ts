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


@Injectable({
  providedIn: 'root'
})
export class OutbreakService {

  private apiURL = environment.apiURL + '/outbreak';  // URL to web api

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

  getOutbreakFromEventRequiringAttention(
    eventRequiringAttention:EventRequiringAttention,
    includeComplexProperties:boolean
  ): Observable<Outbreak|null> {

    const url = this.apiURL + "/get-outbreak-from-event-requiring-attention";

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url,
      {
        "eventRequiringAttention":eventRequiringAttention,
        "includeComplexProperties":includeComplexProperties
      }
    )
    .pipe(map(res => {
      if (res != null) {
        return new Outbreak(res);
      } else {
        return null;
      }
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`getOutbreakFromInfectiousStatus()`, null))
    );
  }

  getOutbreakFromOutbreakFilter(
    outbreak:Outbreak,
    includeComplexProperties:boolean
  ): Observable<Outbreak|null> {

    const url = this.apiURL + "/get-outbreak-from-outbreak-filter";

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url,
      {
        "outbreak":outbreak,
        "includeComplexProperties":includeComplexProperties
      }
    )
    .pipe(map(res => {
      if (res != null) {
        return new Outbreak(res);
      } else {
        return null;
      }
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`getOutbreakFromOutbreakFilter()`, null))
    );
  }

  initializeOutbreak(
    outbreakName:string,
    firstInfectiousStatus:InfectiousStatus,
    criticity:OUTBREAK_CRITICITY,
    refTime:Date
  ): Observable<Outbreak|null> {

    const url = this.apiURL + "/initialize";

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url,
      {
        "firstInfectiousStatus":firstInfectiousStatus,
        "outbreakName":outbreakName,
        "criticity":criticity,
        "refTime":refTime
      }
    )
    .pipe(map(res => {
      if (res != null) {
        return new Outbreak(res);
      } else {
        return null;
      }
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`initializeOutbreak()`, null))
    );
  }

  save(
    outbreak:Outbreak
  ): Observable<Outbreak|null> {

    const url = this.apiURL + "/save";

    return this.http.post<any>(
      url,
      outbreak
    )
    .pipe(map(res => {
      if (res != null) {
        return new Outbreak(res);
      } else {
        return null;
      }
    }))
    .pipe(
    catchError(this.errorHandlerService.handleError(`save()`, null))
    );
  }

  getOutbreakUnitAssosFromOutbreak(
    outbreak:Outbreak
  ): Observable<OutbreakUnitAsso[]> {

    const url = this.apiURL + "/get-outbreak-unit-assos-from-outbreak";

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url,
      {
        "outbreak":outbreak
      }
    )
    .pipe(map(res => {
      return this.fromJSONArrayToOutbreakUnitAssoArray(res)
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`getOutbreakUnitAssosFromOutbreak()`, null))
    );
  }

  getOutbreaksThatCanBeAssociated(
    infectiousStatus:InfectiousStatus
  ): Observable<Outbreak[]> {

    const url = this.apiURL + "/get-outbreaks-that-can-be-associated-to-infectious-status";

    return this.http.post<any>(
      url,
      {
        "infectiousStatus":infectiousStatus
      }
    )
    .pipe(map(res => {
      return this.fromJSONArrayToOutbreakArray(res)
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`getOutbreaksThatCanBeAssociated()`, null))
    );
  }

  getOutbreakInfectiousStatustAssosFromInfectiousStatus(
    infectiousStatus:InfectiousStatus,
    includeComplexProperties:boolean
  ): Observable<OutbreakInfectiousStatusAsso[]> {

    const url = this.apiURL + "/get-outbreak-infectious-status-assos-from-infectious-status";

    return this.http.post<any>(
      url,
      {
        "infectiousStatus":infectiousStatus,
        "includeComplexProperties":includeComplexProperties
      }
    )
    .pipe(map(res => {
      return this.fromJSONArrayToOutbreakUnitAssoArray(res)
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`getOutbreakUnitAssosFromInfectiousStatus()`, null))
    );
  }

  fromJSONArrayToOutbreakUnitAssoArray(array: Array<Object>): OutbreakUnitAsso[] {
    let res = array.map(res => new OutbreakUnitAsso(res));
    console.log(res);
    return res
  }

  fromJSONArrayToOutbreakArray(array: Array<Object>): Outbreak[] {
    let res = array.map(res => new Outbreak(res));
    console.log(res);
    return res
  }

}
