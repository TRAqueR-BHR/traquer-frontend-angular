import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Utils } from '../util/utils';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

   // // URL to web api
  // NOTE: See ForumStyleGuideComponent for the URL of the API to upload a file for a particular styleGuide
  private apiURL = environment.apiURL + '/enum';  


  constructor(private http: HttpClient,
              private errorHandlerService: ErrorHandlerService) { }


  listAllPossibleValues(_type, includeNullOption:boolean = false) {
    if (includeNullOption) {
      return of([null,...Utils.getEnumInts(_type)]);
    } else {
      return of(Utils.getEnumInts(_type));
    }
  }

}
