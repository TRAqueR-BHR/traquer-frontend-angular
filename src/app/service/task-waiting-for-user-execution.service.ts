import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {ErrorHandlerService} from './error-handler.service';
import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UINotificationService } from './uinotification.service';
import { deepCopy, Utils } from '../util/utils';

@Injectable({
  providedIn: 'root'
})
export class TaskWaitingForUserExecutionService {

  private examsURL = environment.apiURL + '/task-waiting-for-user-execution';  // URL to web api

  constructor(private http: HttpClient,
              private errorHandlerService: ErrorHandlerService,
              private uiNotificationService:UINotificationService) { }

  executePendingTasks(): Observable<boolean> {

    let url = this.examsURL + "/execute-pending-tasks";

    return this.http.post<boolean>(url, {})
      .pipe(
          catchError(this.errorHandlerService.handleError<any>(`executePendingTasks`,null))
      );
  }

}
