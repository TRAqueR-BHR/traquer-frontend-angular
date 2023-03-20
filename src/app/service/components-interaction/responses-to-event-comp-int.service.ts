import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsesToEventCompIntService {

  // Observable string sources
  private outbreakInfectiousStatusAssoSource = new Subject<boolean>();

  // Observable string streams
  outbreakInfectiousStatusAsso$ = this.outbreakInfectiousStatusAssoSource.asObservable();

  // Service message commands
  announceOutbreakInfectiousStatusAsso() {
    console.log("DEBUG announceOutbreakInfectiousStatusAsso");
    this.outbreakInfectiousStatusAssoSource.next(true);
  }

  constructor() { }


}
