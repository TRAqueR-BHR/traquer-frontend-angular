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

@Injectable({
  providedIn: 'root'
})
export class StayService {
  
  private apiURL = environment.apiURL + '/stay';  // URL to web api

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

  getCarriersStaysForListingFromOutbreakUnitAsso(
    outbreakUnitAsso:OutbreakUnitAsso
  ): Observable<any[]> {
    
    const url = this.apiURL + "/get-carriers-stays-from-outbreak-unit-asso";
    
    return this.http.post<any>(
      url, 
      {
        "outbreakUnitAsso":outbreakUnitAsso
      }
    )
    .pipe(map(res => { 
      return Utils.convertPlainDataframe(res);
    })) 
    .pipe(
      catchError(this.errorHandlerService.handleError(`getCarriersStaysFromOutbreakUnitAsso()`, null))
    );
  }

  fromJSONArrayToStayArray(array: Array<Object>): Stay[] {
    let res = array.map(res => new Stay(res));    
    return res
  } 
}
