import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExposedFunctionArgument } from '../model-protected/ExposedFunctionArgument';
import { ExposedFunction } from '../model/ExposedFunction';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ExposedFunctionService {

  private apiURL = environment.apiURL + 'exposed-function';  // URL to web api

  constructor(private http: HttpClient,
              private errorHandlerService: ErrorHandlerService) { }

  getFunctions(): Observable<ExposedFunction[]> {

    const url = `${this.apiURL}/get-functions`;
    return this.http.post<ExposedFunction[]>(
      url,
      {}
    )
    .pipe(map(res =>
      this.fromJSONArrayToExposedFunctionArray(res)
      ))
    .pipe(
      catchError(
        this.errorHandlerService.handleError(`ExposedFunctionService.getFunctions`,null)
      )
    );
  }

  execute(exposedFunction:ExposedFunction, args:ExposedFunctionArgument[]): Observable<boolean> {

    exposedFunction.argumentsAsJson = null;

    const url = `${this.apiURL}/execute`;
    return this.http.post<boolean>(
      url,
      {
        "exposedFunction":exposedFunction,
        "args":args
      }
    )
    .pipe(
      catchError(
        this.errorHandlerService.handleError(`ExposedFunctionService.execute`,null)
      )
    );
  }

  fromJSONArrayToExposedFunctionArray(array: Array<Object>): ExposedFunction[] {
    // console.log(array);
    return array.map(res => new ExposedFunction(res));
  }
}
