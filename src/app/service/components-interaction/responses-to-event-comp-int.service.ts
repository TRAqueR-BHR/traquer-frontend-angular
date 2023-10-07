import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsesToEventCompIntService {

  // Observable string sources
  private outbreakInfectiousStatusAssoSource = new Subject<boolean>();
  private isolationTimeSavedSource = new Subject<boolean>();

  // Observable string streams
  outbreakInfectiousStatusAsso$ = this.outbreakInfectiousStatusAssoSource.asObservable();
  isolationTimeSaved$ = this.isolationTimeSavedSource.asObservable();

  // Service message commands
  announceOutbreakInfectiousStatusAsso() {
    console.log("DEBUG announceOutbreakInfectiousStatusAsso");
    this.outbreakInfectiousStatusAssoSource.next(true);
  }

  announceIsolationTimeSaved() {
    this.isolationTimeSavedSource.next(true);
  }

  constructor() { }


}
