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
import { Patient } from '../model/Patient';
import { PatientDecrypt } from '../model-protected/PatientDecrypt';
import { AuthenticationService } from '../module/appuser/service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiURL = environment.apiURL + '/patient';  // URL to web api

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private authenticationService:AuthenticationService
  ) { }

  getPatientsForListing(queryParams:any): Observable<ResultOfQueryWithParams|null> {
    const url = this.apiURL + "/listing";

    var args = deepCopy(queryParams);

    // Force the dates without time to UTC
    var colBirthDate = args.cols.filter(x => x.field == "birthdate")[0] ;
    colBirthDate.filterValue = Utils.forceDateToUTC(colBirthDate.filterValue);

    // Force the dates without time to UTC
    // var colJourneeExploitation = args.cols.filter(x => x.field == "journee_exploitation")[0] ;
    // colJourneeExploitation.filterValue = Utils.forceDateToUTC(colJourneeExploitation.filterValue);
    //  args.dateDebut = Utils.forceDateToUTC(args.dateDebut);
    // args.dateFin = Utils.forceDateToUTC(args.dateFin);

    return this.http.post<ResultOfQueryWithParams>(url,
                                                   JSON.stringify(args))
    .pipe(map(res => {
      let resultOfQuery = new ResultOfQueryWithParams(res);

      // Scramble name if needed
      if (this.authenticationService.isScrambleMode()) {
        resultOfQuery.rows = resultOfQuery.rows.map( x => {
          x["firstname"] = Utils.scrambleString(x["firstname"]);
          x["lastname"] = Utils.scrambleString(x["lastname"]);
          return x;
        });
      }

      return resultOfQuery;
    }))
    .pipe(
      catchError(this.errorHandlerService.handleError(`getPatientsForListing()`, null))
    );
  }

  getPatientDecrypt(patient:Patient): Observable<PatientDecrypt> {
    const url = this.apiURL + "/get-decrypted";

    return this.http.post<any>(
      url,
      patient
    ).pipe(map(res => {

      // Scramble name if needed
      if (this.authenticationService.isScrambleMode()){
        res["firstname"] = Utils.scrambleString(res["firstname"]);
        res["lastname"] = Utils.scrambleString(res["lastname"]);
      }

      return new PatientDecrypt(res);
    })).pipe(
      catchError(this.errorHandlerService.handleError(`getPatientDecrypt()`, null))
    );
  }

  getPatientDecryptedInfoFromId(patientId:string) {
    var url = this.apiURL + "/get-patient-decrypted-info/" + patientId;

    return this.http.get<any[]>(url)
    .pipe(
      catchError(this.errorHandlerService.handleError(
        `getPatientDecryptedInfoFromId()`,
        null))
    );
  }

  create(firstname:string,lastname:string,birthdate:Date): Observable<Patient> {

    birthdate = Utils.forceDateToUTC(birthdate);

    const url = `${this.apiURL}/create`;
    return this.http.post(
      url,
      {
        firstname:firstname,
        lastname:lastname,
        birthdate:birthdate
      })
    .pipe(map(res => {
        return new Patient(res);
     }))
    .pipe(
//        catchError(this.errorHandlerService.handleError<any>(`updatePatient id=${patient.id}`,null))
        catchError(this.errorHandlerService.handleError<any>(`create`,null))
    );
  }

  updatePatientNameAndBirthdate(
    patient: Patient,
    firstname:string,
    lastname:string,
    birthdate:Date): Observable<Patient> {

    birthdate = Utils.forceDateToUTC(birthdate);

    const url = `${this.apiURL}/update-name-and-birthdate`;
    return this.http.post(
      url,
      {
        patient:patient,
        firstname:firstname,
        lastname:lastname,
        birthdate:birthdate
      })
    .pipe(map(res => {
        return new Patient(res);
     }))
    .pipe(
//        catchError(this.errorHandlerService.handleError<any>(`updatePatient id=${patient.id}`,null))
        catchError(this.errorHandlerService.handleError<any>(`updatePatientNameAndBirthdate[${patient.id}]`,null))
    );
  }

  fromJSONArrayToPatientArray(array: Array<Object>): Patient[] {
    let res = array.map(res => new Patient(res));
    console.log(res);
    return res
  }


}
