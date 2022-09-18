import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { USER_RESPONSE_TYPE } from 'src/app/enum/USER_RESPONSE_TYPE';
import { EventRequiringAttention } from 'src/app/model/EventRequiringAttention';
import { InfectiousStatus } from 'src/app/model/InfectiousStatus';
import { EnumService } from 'src/app/service/enum.service';
import { EventRequiringAttentionService } from 'src/app/service/event-requiring-attention.service';
import { SelectItemService } from 'src/app/service/select-item.service';

@Component({
  selector: 'app-responses-to-event',
  templateUrl: './responses-to-event.component.html',
  styleUrls: ['./responses-to-event.component.scss']
})
export class ResponsesToEventComponent implements OnInit {

  @Input()
  eventRequiringAttention:EventRequiringAttention;

  infectiousStatus:InfectiousStatus;  

  optionsUSER_RESPONSE_TYPE:SelectItem[] = [];

  // Resources loaded checker
  resourcesLoadedChecker = {
    resourcesAreLoaded: false,
    resourcesLoaded:{      
      eventRequiringAttention:false,
      optionsUSER_RESPONSE_TYPE:false,
    }    
  }


  constructor(
    private route: ActivatedRoute,
    private eventRequiringAttentionService:EventRequiringAttentionService,
    private enumService:EnumService,
    private selectItemService:SelectItemService
  ) { }

  ngOnInit(): void {
    this.getEventRequiringAttention();
    this.getOptionsUSER_RESPONSE_TYPE();
  }

  getEventRequiringAttention(): void {

    // In debug mode, the exam is not passed by the parent component.
    //   Need to retrieve it from the URL
    if (this.eventRequiringAttention == null) {
      const id = this.route.snapshot.paramMap.get('id');   

      this.eventRequiringAttentionService.getEventRequiringAttention(id).subscribe(
        res => {
          if (res != null) {
            this.eventRequiringAttention = res;  
            this.resourcesLoadedChecker.resourcesLoaded.eventRequiringAttention = true;
            this.updateResourcesLoaded();   
          }
        });
    } else {
      this.resourcesLoadedChecker.resourcesLoaded.eventRequiringAttention = true;
      this.updateResourcesLoaded();   
    }
    
  }

  getOptionsUSER_RESPONSE_TYPE(){
    this.enumService.listAllPossibleValues(USER_RESPONSE_TYPE).subscribe(
      res => {
        this.optionsUSER_RESPONSE_TYPE = 
          this.selectItemService.createSelectItemsForEnums(res,USER_RESPONSE_TYPE,false,"USER_RESPONSE_TYPE_");
        this.resourcesLoadedChecker.resourcesLoaded.optionsUSER_RESPONSE_TYPE = true;
        this.updateResourcesLoaded();
      }
    );
  }

  updateResourcesLoaded():void {
    for (let k in this.resourcesLoadedChecker) {
      // console.log(this.resourcesLoadedChecker[k]);
      if (this.resourcesLoadedChecker[k] instanceof Object) {
        for (let ksub in this.resourcesLoadedChecker[k]) {
          if (this.resourcesLoadedChecker[k][ksub] == false) {
            this.resourcesLoadedChecker.resourcesAreLoaded = false;
            console.log(`${ksub} is false`);
            return;
          }
        }
      }         
    }
    this.resourcesLoadedChecker.resourcesAreLoaded = true;    
  }

}
