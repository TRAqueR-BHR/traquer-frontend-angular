import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { INFECTIOUS_AGENT_CATEGORY } from 'src/app/enum/INFECTIOUS_AGENT_CATEGORY';
import { INFECTIOUS_STATUS_TYPE } from 'src/app/enum/INFECTIOUS_STATUS_TYPE';
import { OUTBREAK_CRITICITY } from 'src/app/enum/OUTBREAK_CRITICITY';
import { InfectiousStatus } from 'src/app/model/InfectiousStatus';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { EnumService } from 'src/app/service/enum.service';
import { InfectiousStatusService } from 'src/app/service/infectious-status.service';
import { OutbreakService } from 'src/app/service/outbreak.service';
import { SelectItemService } from 'src/app/service/select-item.service';

@Component({
  selector: 'app-infectious-status-edit',
  templateUrl: './infectious-status-edit.component.html',
  styleUrls: ['./infectious-status-edit.component.scss']
})
export class InfectiousStatusEditComponent implements OnInit {

  @Input()
  infectiousStatus:InfectiousStatus;

  optionsINFECTIOUS_STATUS_TYPE:SelectItem[] = [];
  optionsINFECTIOUS_AGENT_CATEGORY:SelectItem[] = [];

  // Display booleans
  debug:boolean = false;

  // Resources loaded checker
  resourcesLoadedChecker = {
    resourcesAreLoaded: false,
    resourcesLoaded:{
      outbreakUnitAssos:false
    }
  }

  constructor(
    private translationService:TranslationService,
    private route: ActivatedRoute,
    private outbreakService:OutbreakService,
    private infectiousStatusService:InfectiousStatusService,
    private enumService:EnumService,
    private selectItemService:SelectItemService,
  ) { }

  ngOnInit(): void {
    this.prepareOptionsINFECTIOUS_STATUS_TYPE();
    this.prepareOptionsINFECTIOUS_AGENT_CATEGORY();
    this.setDebuggingComponentFlag();
    this.getInfectiousStatusAndOutbreaks();
  }

  getInfectiousStatusAndOutbreaks(){

    if (this.infectiousStatus != null) {
      this.getOutbreakInfectiousStatusAssosFromInfectiousStatus();
    }
    else if (this.debug === true){
      const id = this.route.snapshot.paramMap.get('infectiousStatusId');
      this.infectiousStatusService.geInfectiousStatusFromInfectiousStatusFilter(
          new InfectiousStatus({"id":id}),true
        )
        .subscribe(res => {
          if (res != null) {
            this.infectiousStatus = res[0];
            console.log(this.infectiousStatus);
            this.getOutbreakInfectiousStatusAssosFromInfectiousStatus();
          }
        });
    }
  }

  getOutbreakInfectiousStatusAssosFromInfectiousStatus(){

  }

  save(){
  }

  prepareOptionsINFECTIOUS_STATUS_TYPE() {
    this.enumService.listAllPossibleValues(INFECTIOUS_STATUS_TYPE).subscribe(
      res => {
          this.optionsINFECTIOUS_STATUS_TYPE =
            this.selectItemService.createSelectItemsForEnums(
              res,
              INFECTIOUS_STATUS_TYPE,
              false, // null options
              );
      }
    );
  }

  prepareOptionsINFECTIOUS_AGENT_CATEGORY() {
    this.enumService.listAllPossibleValues(INFECTIOUS_AGENT_CATEGORY).subscribe(
      res => {
          this.optionsINFECTIOUS_AGENT_CATEGORY =
            this.selectItemService.createSelectItemsForEnums(
              res,
              INFECTIOUS_AGENT_CATEGORY,
              false, // null options
              );
      }
    );
  }

  setDebuggingComponentFlag() {
    if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[0].path == "debug4") {
      this.debug = true;
    }
  }

}
