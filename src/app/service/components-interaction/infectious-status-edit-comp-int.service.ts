import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PatientDecrypt } from 'src/app/model-protected/PatientDecrypt';

@Injectable({
  providedIn: 'root'
})
export class InfectiousStatusEditCompIntService {

  // Observable string sources
  private patientSelectedSource = new Subject<PatientDecrypt>();

  // Observable string streams
  patientSelected$ = this.patientSelectedSource.asObservable();

  // Service message commands
  announcePatientSelected(patientDecrypt:PatientDecrypt) {
    this.patientSelectedSource.next(patientDecrypt);
  }

  constructor() { }
}
