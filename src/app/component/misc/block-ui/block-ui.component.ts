import { Component, OnInit } from '@angular/core';
import { BlockUiService } from 'src/app/service/block-ui.service';

@Component({
  selector: 'app-block-ui',
  templateUrl: './block-ui.component.html',
  styleUrls: ['./block-ui.component.scss']
})
export class BlockUiComponent implements OnInit {

  uiBlocked:boolean = false;
  numberOfProcesses:number;
  displayProcessesInfo:boolean;

  constructor(public blockUiService:BlockUiService) { 
    this.blockUiService.blockingProcessSource$.subscribe(res =>{  

      // The timeout is a dirty workaround to https://blog.angular-university.io/angular-debugging/
      setTimeout(() => {
        this.uiBlocked = true; 
      }, 100); 
           
    });
    this.blockUiService.unblockingProcessSource$.subscribe(res =>{
      setTimeout(() => {
        this.uiBlocked = false; 
      }, 100);
    });
  }

  ngOnInit() {
    // this.displayProcessesInfo = environment.displayProcessesInfo;
    // this.uiBlocked = false;
  }

}
