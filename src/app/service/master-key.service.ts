import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MasterKeyService {

  private apiURL = environment.apiURL + '/master-key';

  // Source of truth for "is the master key set?" across the app.
  // Initialized lazily from the server on first read; updated whenever
  //   the user successfully sets the master key in this session.
  private isMasterKeySetSubject = new BehaviorSubject<boolean | null>(null);
  public isMasterKeySet$: Observable<boolean | null> = this.isMasterKeySetSubject.asObservable();

  // Convenience stream that only emits resolved (non-null) values.
  //   Use this to react when the master key state transitions from
  //   unset -> set or set -> unset after the app has booted.
  public isMasterKeySetResolved$: Observable<boolean> = this.isMasterKeySet$.pipe(
    filter((v): v is boolean => v !== null),
  );

  constructor(private http: HttpClient,
              private errorHandlerService: ErrorHandlerService) { }

  public checkMasterKeyIsValid(
    masterKeyWords: string[]
  ): Observable<boolean> {

    const url = this.apiURL + "/check";

    return this.http.post<{isValid: boolean}>(
      url,
      JSON.stringify(masterKeyWords),
    )
    .pipe(map(res => res != null && res.isValid === true))
    .pipe(
      catchError(this.errorHandlerService.handleError(`checkMasterKeyIsValid()`, false))
    );
  }

  public setMasterKey(
    masterKeyWords: string[]
  ): Observable<boolean> {

    const url = this.apiURL + "/set";

    return this.http.post<{success: boolean}>(
      url,
      JSON.stringify(masterKeyWords),
    )
    .pipe(map(res => {
      const success = res != null && res.success === true;
      if (success) {
        // Once successfully set on the server, flip the cached flag
        //   so other components can react synchronously.
        this.isMasterKeySetSubject.next(true);
      }
      return success;
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`setMasterKey()`, false))
    );
  }

  public fetchIsMasterKeySet(): Observable<boolean> {

    const url = this.apiURL + "/is-set";

    return this.http.get<{isSet: boolean}>(
      url,
    )
    .pipe(map(res => {
      const isSet = res != null && res.isSet === true;
      this.isMasterKeySetSubject.next(isSet);
      return isSet;
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`fetchIsMasterKeySet()`, false))
    );
  }

  /**
   * Synchronous accessor. Returns:
   *   - `true`/`false` once the value has been resolved at least once
   *   - `null` if no check has happened yet (call `fetchIsMasterKeySet()`
   *      or subscribe to `isMasterKeySet$` to get the real value).
   */
  public getIsMasterKeySet(): boolean | null {
    return this.isMasterKeySetSubject.value;
  }
}