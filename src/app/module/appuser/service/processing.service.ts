import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessingService {

  public processes = 0;
  private blockingProcessSource = new Subject<boolean>();
  blockingProcessSource$ = this.blockingProcessSource.asObservable();

  private unblockingProcessSource = new Subject<boolean>();
  unblockingProcessSource$ = this.unblockingProcessSource.asObservable();


  constructor() { }

  clearProcessesList(whatFor:string) {
    if (environment.debugBlockUnblockUI) {
      console.log(`ProcessingService.clearProcessesList[${whatFor}]`);
    }    
    this.processes = 0;
    // this.unblockUI();
  }

  blockUI(whatFor:string){
    if (environment.debugBlockUnblockUI) {
      console.log(`ProcessingService.blockUI[${whatFor}]`);
    }
    this.processes++;
    // console.log(`this.processes[${this.processes}]`);
    this.blockingProcessSource.next(true);
  }

  unblockUI(whatFor:string){
    if (environment.debugBlockUnblockUI) {
      console.log(`ProcessingService.unblockUI[${whatFor}]`);
    }
    this.processes--;
    const _this = this;
    // We may not be carefull in the way we call blockUI/unblockUI, 
    //   Eg. We call blockUI in the constructor and unblockUI in 'ngOnInit'
    //       with no round trip to the server. In that case unblockUI will be 
    //       called before blockUI resulting in the application being stuck in 
    //       in a block position.
    setTimeout(function(){ 
      _this.unblockingProcessSource.next(true);
    }, 
    200);    
  }

}
