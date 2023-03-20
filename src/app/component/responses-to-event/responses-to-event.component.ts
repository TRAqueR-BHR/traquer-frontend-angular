import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { INFECTIOUS_AGENT_CATEGORY } from 'src/app/enum/INFECTIOUS_AGENT_CATEGORY';
import { OUTBREAK_CRITICITY } from 'src/app/enum/OUTBREAK_CRITICITY';
import { RESPONSE_TYPE } from 'src/app/enum/RESPONSE_TYPE';
import { EventRequiringAttention } from 'src/app/model/EventRequiringAttention';
import { InfectiousStatus } from 'src/app/model/InfectiousStatus';
import { Outbreak } from 'src/app/model/Outbreak';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { ResponsesToEventCompIntService } from 'src/app/service/components-interaction/responses-to-event-comp-int.service';
import { EnumService } from 'src/app/service/enum.service';
import { EventRequiringAttentionService } from 'src/app/service/event-requiring-attention.service';
import { InfectiousStatusService } from 'src/app/service/infectious-status.service';
import { OutbreakService } from 'src/app/service/outbreak.service';
import { SelectItemService } from 'src/app/service/select-item.service';
import { UINotificationService } from 'src/app/service/uinotification.service';
import { Utils } from 'src/app/util/utils';

@Component({
  selector: 'app-responses-to-event',
  templateUrl: './responses-to-event.component.html',
  styleUrls: ['./responses-to-event.component.scss'],
  providers: [ResponsesToEventCompIntService]
})
export class ResponsesToEventComponent implements OnInit {

  @Input()
  eventRequiringAttention:EventRequiringAttention;

  infectiousStatus:InfectiousStatus;
  outbreak:Outbreak;

  optionsRESPONSE_TYPE:SelectItem[] = [];

  // Display booleans
  canDisplayOutbreak = false;
  canDisplayAssociateInfectiousStatusToOutbreaksComponent = false;

  // Resources loaded checker
  resourcesLoadedChecker = {
    resourcesAreLoaded: false,
    resourcesLoaded:{
      eventRequiringAttention:false,
      optionsRESPONSE_TYPE:false
    }
  }

  // Observable subscriptions
  subscriptions: Subscription[] = [];


  constructor(
    private route: ActivatedRoute,
    private eventRequiringAttentionService:EventRequiringAttentionService,
    private enumService:EnumService,
    private selectItemService:SelectItemService,
    private outbreakService:OutbreakService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    public notificationService:UINotificationService,
    private infectiousStatusService:InfectiousStatusService,
    private translationService:TranslationService,
    private responsesToEventCompIntService:ResponsesToEventCompIntService
  ) {
    this.createSubscriptions();
  }

  ngOnInit(): void {
    this.getOptionsRESPONSE_TYPE();
    this.getEventRequiringAttention();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  createSubscriptions() {

    const subscription_OutbreakInfectiousStatusAsso =
      this.responsesToEventCompIntService.outbreakInfectiousStatusAsso$.subscribe(
        bool => {
          this.getOutbreak();
        }
      );
    this.subscriptions.push(subscription_OutbreakInfectiousStatusAsso);

  }

  getEventRequiringAttention(): void {

    // Get the event from the dialog input config if any
    if (this.dialogConfig != null && this.dialogConfig.data != null) {
      this.eventRequiringAttention = this.dialogConfig.data.eventRequiringAttention;
    }

    // In debug mode, the exam is not passed by the parent component.
    //   Need to retrieve it from the URL
    if (this.eventRequiringAttention == null) {

      const eventId = this.route.snapshot.paramMap.get('eventId');

      this.eventRequiringAttentionService.getEventRequiringAttention(eventId).subscribe(
        res => {
          if (res != null) {

            this.eventRequiringAttention = res;

            this.infectiousStatus = this.eventRequiringAttention.infectiousStatus;
            this.getOutbreak();

            this.resourcesLoadedChecker.resourcesLoaded.eventRequiringAttention = true;
            this.updateResourcesLoaded();

          }
        });
    } else {
      this.infectiousStatus = this.eventRequiringAttention.infectiousStatus;
      this.getOutbreak();

      this.resourcesLoadedChecker.resourcesLoaded.eventRequiringAttention = true;
      this.updateResourcesLoaded();
    }

  }

  getOutbreak() {

    console.log("DEBUG getOutbreak");

    if (this.infectiousStatus == null) {
      return;
    }

    this.outbreakService.getOutbreakFromEventRequiringAttention(this.eventRequiringAttention, true)
    .subscribe(res => {
      console.log(res);
      if (res != null){
        this.outbreak = res;
      }
      this.updateResourcesLoaded(); // needed to update `canDisplayOutbreak`
    });

  }

  disableOptions(){

    for (let o of this.optionsRESPONSE_TYPE){
      o.disabled = false;
      if (o.value == RESPONSE_TYPE.declare_outbreak){

          if (this.infectiousStatus != null
            && this.infectiousStatus.isConfirmed == false){
              console.log(this.infectiousStatus.id);
              o.disabled = true;
            }
      }
    }

    // Force angular to detect the change
    this.optionsRESPONSE_TYPE = [...this.optionsRESPONSE_TYPE];
  }

  getOptionsRESPONSE_TYPE(){
    this.enumService.listAllPossibleValues(RESPONSE_TYPE).subscribe(
      res => {
        this.optionsRESPONSE_TYPE =
          this.selectItemService.createSelectItemsForEnums(res,RESPONSE_TYPE,false,"RESPONSE_TYPE_");
        this.resourcesLoadedChecker.resourcesLoaded.optionsRESPONSE_TYPE = true;
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
    this.updateDisplayBooleans();
    this.disableOptions();
  }

  updateDisplayBooleans(){

    if (this.outbreak != null){
      this.canDisplayOutbreak = true;
    } else {
      this.canDisplayOutbreak = false;
    }

    if (
      this.eventRequiringAttention.responsesTypes != null
      && this.eventRequiringAttention.responsesTypes.includes(RESPONSE_TYPE.associate_to_existing_outbreak)
    ){
      this.canDisplayAssociateInfectiousStatusToOutbreaksComponent = true;
    } else {
      this.canDisplayAssociateInfectiousStatusToOutbreaksComponent = false;
    }

  }

  save() {
    this.eventRequiringAttentionService.update(this.eventRequiringAttention).subscribe(
      res => {
        // do nothing
      }
    );
  }

  updateInfectiousStatus() {
    this.infectiousStatusService.upsert(this.infectiousStatus).subscribe(res => {
      if (res != null){
        this.infectiousStatus = res;
        this.notificationService.notifySuccess(
          this.translationService.getTranslation("infectious_status_updated"));
        this.disableOptions();
      }
    });
  }

  handleResponsesTypesChange(evt,val){

    // ################################################# //
    // Get what has been added and what has been removed //
    // ################################################# //
    let changes = Utils.getArrayDiff(
      this.eventRequiringAttention.responsesTypes, // oldArr:any[],
      evt, // newArr:any[]
    )

    // ##################################### //
    // Take actions depending on the choices //
    // ##################################### //

    // New outbreak
    if (changes.elementsAdded.includes(RESPONSE_TYPE.declare_outbreak)) {

      // Check that the infectious status is confirmed
      if (!evt.includes(RESPONSE_TYPE.confirm)){
        this.notificationService.notifyWarn(
          this.translationService.getTranslation(
            "infectious_status_must_be_confirmed_to_initialize_the_outbreak")
        );
      }

      // If create a new outbreak
      if (this.outbreak == null) {
        this.outbreak = new Outbreak({
          "infectiousAgent":INFECTIOUS_AGENT_CATEGORY[this.eventRequiringAttention.infectiousStatus.infectiousAgent],
          "criticity":OUTBREAK_CRITICITY.dont_know,
          "refTime":this.eventRequiringAttention.refTime
        });
      }
    } else if(changes.elementsRemoved.includes(RESPONSE_TYPE.declare_outbreak)){
      if (this.outbreak != null && this.outbreak.id == null) {
        this.outbreak = null;
      }
    }

    // Confirm status
    if (changes.elementsAdded.includes(RESPONSE_TYPE.confirm)) {
      this.infectiousStatus.isConfirmed = true;
      this.updateInfectiousStatus();
    }

    // ############## //
    // Save the event //
    // ############## //
    this.eventRequiringAttention.responsesTypes = evt;
    this.checkIfResponseIsGiven();
    this.save();

    this.updateDisplayBooleans();
  }

  // We consider that an event is not pending if there is at least one response
  checkIfResponseIsGiven() {

    if (this.eventRequiringAttention.responsesTypes == null
      || this.eventRequiringAttention.responsesTypes.length == 0){
        this.eventRequiringAttention.isPending = true;
    } else {
      this.eventRequiringAttention.isPending = false;

    }

  }

}
