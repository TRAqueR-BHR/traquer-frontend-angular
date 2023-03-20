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
import { Unit } from '../model/Unit';


@Injectable({
  providedIn: 'root'
})
export class UnitService {


  private apiURL = environment.apiURL + '/unit';  // URL to web api

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

  getAllUnits(includeComplexProperties:boolean): Observable<Unit[]|null> {

    const url = this.apiURL + "/get-all-units";

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url,
      {
        "includeComplexProperties":includeComplexProperties
      }
    )
    .pipe(map(res => {
      if (res != null) {
        return this.fromJSONArrayToUnitArray(res);
      } else {
        return null;
      }
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`getAllUnits()`, null))
    );
  }

  fromJSONArrayToUnitArray(array: Array<Object>): Unit[] {
    let res = array.map(res => new Unit(res));
    return res
  }

}
