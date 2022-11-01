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
import { OutbreakConfig } from '../model/OutbreakConfig';
import { OutbreakConfigUnitAsso } from '../model/OutbreakConfigUnitAsso';


@Injectable({
  providedIn: 'root'
})
export class OutbreakConfigService {
  
  private apiURL = environment.apiURL + '/outbreak-config';  // URL to web api

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

  getOutbreakConfigUnitAssosFromOutbreakConfig(
    outbreakConfig:OutbreakConfig
  ): Observable<OutbreakConfigUnitAsso[]> {
    
    const url = this.apiURL + "/get-outbreak-config-unit-assos-from-outbreak-config";
    
    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url, 
      {
        "outbreakConfig":outbreakConfig
      }
    )
    .pipe(map(res => { 
      return this.fromJSONArrayToOutbreakConfigUnitAssoArray(res)
    })) 
    .pipe(
      catchError(this.errorHandlerService.handleError(`getOutbreakConfigUnitAssosFromOutbreakConfig()`, null))
    );
  }

  fromJSONArrayToOutbreakConfigUnitAssoArray(array: Array<Object>): OutbreakConfigUnitAsso[] {
    console.log(array);
    let res = array.map(res => new OutbreakConfigUnitAsso(res));
    console.log(res);
    return res
  } 

}
