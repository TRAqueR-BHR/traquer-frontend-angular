import { Injectable } from '@angular/core';
import moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ResultOfQueryWithParams } from 'src/app/model-protected/ResultOfQueryWithParams';
import { Utils, deepCopy } from '../util/utils';
import { EventRequiringAttention } from '../model/EventRequiringAttention';


@Injectable({
  providedIn: 'root'
})
export class EventRequiringAttentionService {

  private apiURL = environment.apiURL + '/event-requiring-attention';  // URL to web api

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

  getEventRequiringAttention(eventId:string): Observable<EventRequiringAttention|null> {
    const url = Utils.removeDoubleSlashesInURL(this.apiURL + "/get-event");
    console.log(`url[${url}]`);
    
    return this.http.post<any>(
      url,
      {"eventId":eventId}
    )    
    .pipe(map(res => {        
      return new EventRequiringAttention(res);
    })) 
    .pipe(
    catchError(this.errorHandlerService.handleError(`getEventRequiringAttention()`, null))
    );
  }

  update(eventRequiringAttention:EventRequiringAttention) {

    const url = this.apiURL + "/update";
    
    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    // args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<any>(
      url, 
      eventRequiringAttention
    )
    .pipe(map(res => {      
      if (res != null) {
        return new EventRequiringAttention(res);
      } else {
        return null;
      }
    })) 
    .pipe(
    catchError(this.errorHandlerService.handleError(`EventRequiringAttentionService.update()`, null))
    );
    
  }
}
