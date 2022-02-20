import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetPasswordService {

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService) { }

  public getWordsList(languageCode:string):Observable<any[]|null> {
    
    let fileUrl = `assets/wordslist/${languageCode}.json`;

    return this.http.get<any>(fileUrl)    
    // .pipe(map(
    //         res=>res
    //     )
    // )
    .pipe(
        catchError(this.errorHandlerService.handleError(`getWordsList()`, null))
    );
  } 
}
