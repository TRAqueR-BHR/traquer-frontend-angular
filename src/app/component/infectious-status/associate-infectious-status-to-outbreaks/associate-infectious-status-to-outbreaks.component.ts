import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { InfectiousStatus } from 'src/app/model/InfectiousStatus';
import { Outbreak } from 'src/app/model/Outbreak';
import { OutbreakInfectiousStatusAsso } from 'src/app/model/OutbreakInfectiousStatusAsso';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { ResponsesToEventCompIntService } from 'src/app/service/components-interaction/responses-to-event-comp-int.service';
import { EnumService } from 'src/app/service/enum.service';
import { InfectiousStatusService } from 'src/app/service/infectious-status.service';
import { OutbreakService } from 'src/app/service/outbreak.service';
import { SelectItemService } from 'src/app/service/select-item.service';

@Component({
  selector: 'app-associate-infectious-status-to-outbreaks',
  templateUrl: './associate-infectious-status-to-outbreaks.component.html',
  styleUrls: ['./associate-infectious-status-to-outbreaks.component.scss'],
})
export class AssociateInfectiousStatusToOutbreaksComponent implements OnInit {

  @Input()
  infectiousStatus:InfectiousStatus;

  outbreakInfectiousStatusAssos:OutbreakInfectiousStatusAsso[] = [];

  optionsOutbreak:SelectItem[] = [];

  selectedOutbreaksIds:string[] = [];

  // Display booleans
  debug:boolean = false;

  // Resources loaded checker
  resourcesLoadedChecker = {
    resourcesAreLoaded: false,
    resourcesLoaded:{
      allPossibleOutbreaks:false,
      outbreakInfectiousStatusAssos:false
    }
  }

  constructor(
    private translationService:TranslationService,
    private route: ActivatedRoute,
    private outbreakService:OutbreakService,
    private enumService:EnumService,
    private selectItemService:SelectItemService,
    private infectiousStatusService:InfectiousStatusService,
    private responsesToEventCompIntService:ResponsesToEventCompIntService
  ) {
  }

  ngOnInit(): void {
    this.setDebuggingComponentFlag();
    this.getInfectiousStatus();
  }

  getInfectiousStatus(){

    if (this.infectiousStatus != null) {
      this.getOptionsOutbreak();
      this.getOutbreakInfectiousStatusAssos();
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
            this.getOptionsOutbreak();
            this.getOutbreakInfectiousStatusAssos();
          }
        });
    }
  }

  getOptionsOutbreak(){
    this.outbreakService.getOutbreaksThatCanBeAssociated(this.infectiousStatus).subscribe(
      res => {
        if (res != null) {
          this.optionsOutbreak = this.selectItemService.createSelectItemsForEntities(
            res,
            "id",
            "name"
          )
          this.resourcesLoadedChecker.resourcesLoaded.allPossibleOutbreaks = true;
          this.updateResourcesLoaded();
        }
      }
    );
  }

  getOutbreakInfectiousStatusAssos(){
    this.outbreakService.getOutbreakInfectiousStatustAssosFromInfectiousStatus(
      this.infectiousStatus,
      true
    ).subscribe(
      res => {
        if (res != null) {
          this.outbreakInfectiousStatusAssos = res;
          this.resourcesLoadedChecker.resourcesLoaded.outbreakInfectiousStatusAssos = true;
          this.updateResourcesLoaded();
        }
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
    this.initializeSelected();
    this.updateDisplayBooleans();
  }

  handleChangeOnSelectedOutbreaksIds(evt){
    this.infectiousStatus.outbreakInfectiousStatusAssoes = [];
    let newAsso:OutbreakInfectiousStatusAsso;
    for (let id of this.selectedOutbreaksIds) {
      newAsso = new OutbreakInfectiousStatusAsso({});
      newAsso.outbreak = new Outbreak({id:id});
      // newAsso.infectiousStatus = this.infectiousStatus;
      this.infectiousStatus.outbreakInfectiousStatusAssoes.push(newAsso);
    }
  }

  updateDisplayBooleans() {

  }

  initializeSelected(){
    console.log(this.outbreakInfectiousStatusAssos);
    this.selectedOutbreaksIds = this.outbreakInfectiousStatusAssos.map(x => x.outbreak.id);
  }

  setDebuggingComponentFlag() {
    if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[0].path == "debug6") {
      this.debug = true;
    }
  }

  save(){
    console.log(this.infectiousStatus.outbreakInfectiousStatusAssoes);
    this.infectiousStatusService.updateVectorPropertyOutbreakInfectiousStatusAssoes(
      this.infectiousStatus
    ).subscribe(res => {
      this.responsesToEventCompIntService.announceOutbreakInfectiousStatusAsso();
    });
  }

}
