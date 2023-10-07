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
export class OutbreakUnitAssoService {

  private apiURL = environment.apiURL + '/outbreak-unit-asso';  // URL to web api

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

  updateAssoAndRefreshExposuresAndContactStatuses(
    asso:OutbreakUnitAsso
  ): Observable<boolean> {

    const url = this.apiURL + "/update-asso-and-refresh-exposures-and-contact-statuses";

    return this.http.post<any[]>(
      url,
      {
        "outbreakUnitAsso":asso
      }
    )
    .pipe(
      catchError(this.errorHandlerService.handleError(`generateContactExposuresAndInfectiousStatuses()`, null))
    );
  }
}
