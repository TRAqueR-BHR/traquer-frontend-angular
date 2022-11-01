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


@Injectable({
  providedIn: 'root'
})
export class OutbreakService {

  private apiURL = environment.apiURL + '/outbreak';  // URL to web api

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

  getOutbreakFromInfectiousStatus(
    infectiousStatus:InfectiousStatus,
    includeComplexProperties:boolean
  ): Observable<Outbreak|null> {
    
    const url = this.apiURL + "/get-outbreak-from-infectious-status";
    
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
        "outbreakName":outbreakName
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

}
