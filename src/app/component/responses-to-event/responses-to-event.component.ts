import { Component, Inject, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { INFECTIOUS_AGENT_CATEGORY } from 'src/app/enum/INFECTIOUS_AGENT_CATEGORY';
import { OUTBREAK_CRITICITY } from 'src/app/enum/OUTBREAK_CRITICITY';
import { RESPONSE_TYPE } from 'src/app/enum/RESPONSE_TYPE';
import { EventRequiringAttention } from 'src/app/model/EventRequiringAttention';
import { InfectiousStatus } from 'src/app/model/InfectiousStatus';
import { Outbreak } from 'src/app/model/Outbreak';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { ResponsesToEventCompIntService } from 'src/app/service/components-interaction/responses-to-event-comp-int.service';
import { EnumService } from 'src/app/service/enum.service';
import { EventRequiringAttentionService } from 'src/app/service/event-requiring-attention.service';
import { InfectiousStatusService } from 'src/app/service/infectious-status.service';
import { OutbreakService } from 'src/app/service/outbreak.service';
import { SelectItemService } from 'src/app/service/select-item.service';
import { StayService } from 'src/app/service/stay.service';
import { UINotificationService } from 'src/app/service/uinotification.service';
import { Utils } from 'src/app/util/utils';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { InfectiousStatusExplanationComponent } from '../infectious-status/infectious-status-explanation/infectious-status-explanation.component';
import { Patient } from 'src/app/model/Patient';
import { NgForm } from '@angular/forms';
import { PatientService } from 'src/app/service/patient.service';
import { PatientDecrypt } from 'src/app/model-protected/PatientDecrypt';
import { BlockUiService } from 'src/app/service/block-ui.service';

@Component({
  selector: 'app-responses-to-event',
  templateUrl: './responses-to-event.component.html',
  styleUrls: ['./responses-to-event.component.scss'],
  providers: [ResponsesToEventCompIntService,DialogService]
})
export class ResponsesToEventComponent implements OnInit {

  @Input()
  eventRequiringAttention:EventRequiringAttention;

  infectiousStatus:InfectiousStatus;
  outbreak:Outbreak;
  patientDecrypt:PatientDecrypt;
  patient:Patient; // For conveinience, we can very well just use infectiousStatus.patient

  isolationTime:Date;

  // Options
  optionsRESPONSE_TYPE:SelectItem[] = [];

  // Display booleans
  canDisplayOutbreak = false;
  canDisplayIsolationTime = false;
  processingSavePatientIsolationDate = false;
  canDisplayRequestAnalysisComponent = false;

  canDisplayAssociateInfectiousStatusToOutbreaksComponent = false;
  debugComponent:boolean = false;
  isDebugMode:boolean = false;

  // Resources loaded checker
  resourcesLoadedChecker = {
    resourcesAreLoaded: false,
    resourcesLoaded:{
      eventRequiringAttention:false,
      optionsRESPONSE_TYPE:false,
      patientDecrypt:false
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
    private responsesToEventCompIntService:ResponsesToEventCompIntService,
    private authenticationService:AuthenticationService,
    private dialogService:DialogService,
    private confirmationService: ConfirmationService,
    private stayService:StayService,
    private patientService:PatientService,
    private blockUiService:BlockUiService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.createSubscriptions();
  }

  ngOnInit(): void {
    this.isDebugMode = this.authenticationService.isDebugMode();
    this.setDebuggingComponentFlag();
    this.getOptionsRESPONSE_TYPE();
    this.getEventRequiringAttention();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  createSubscriptions() {

    // When the infectious status of the response gets added to an outbreak, we want to
    // refresh the page
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
    if (this.debugComponent && this.eventRequiringAttention == null) {

      const eventId = this.route.snapshot.paramMap.get('eventId');

      this.eventRequiringAttentionService.getEventRequiringAttention(eventId).subscribe(
        res => {
          if (res != null) {

            this.eventRequiringAttention = res;

            // CAUTION: the following lines must be duplicated in the 'else' block below
            // TODO: Find a way to avoid this duplication
            this.infectiousStatus = this.eventRequiringAttention.infectiousStatus;
            this.patient = this.infectiousStatus.patient;
            this.getPatientDecrypt();
            this.getOutbreak();

            // Update the resources loaded checker
            this.resourcesLoadedChecker.resourcesLoaded.eventRequiringAttention = true;
            this.updateResourcesLoaded();

          }
        });
    } else {
      this.infectiousStatus = this.eventRequiringAttention.infectiousStatus;
      this.patient = this.infectiousStatus.patient;
      this.getPatientDecrypt();
      this.getOutbreak();

      // Update the resources loaded checker
      this.resourcesLoadedChecker.resourcesLoaded.eventRequiringAttention = true;
      this.updateResourcesLoaded();
    }

  }

  getOutbreak() {

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

    // ################################################################################# //
    // NOTE: A lot of display booleans are set in `handleResponsesTypesChange(evt, val)` //
    // ################################################################################# //

    // Outbreak display boolean
    if (this.outbreak != null){
      this.canDisplayOutbreak = true;
    } else {
      this.canDisplayOutbreak = false;
    }

  }

  save() {
    this.eventRequiringAttentionService.update(this.eventRequiringAttention).subscribe(
      res => {
        this.notificationService.notifySuccess(
          this.translationService.getTranslation("saved")
        );
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

  deleteInfectiousStatus() {

    this.blockUiService.blockUI("deleteInfectiousStatus()");

    this.infectiousStatusService.delete(this.infectiousStatus).subscribe(res => {
      this.blockUiService.unblockUI("deleteInfectiousStatus()");
      if (res != null){
        this.infectiousStatus = res;
        this.notificationService.notifySuccess(
          this.translationService.getTranslation("infectious_status_deleted"));

        // Close the current dialog (in case this component is displayed in a dialog),
        // because the infectious status has been deleted and this dialog is therefore
        // deprecated
        this.dialogRef.close();
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

    // ############ //
    // New outbreak //
    // ############ //
    if (changes.elementsAdded.includes(RESPONSE_TYPE.declare_outbreak)) {

      // Check that the infectious status is confirmed
      if (!evt.includes(RESPONSE_TYPE.confirm)){
        this.notificationService.notifyWarn(
          this.translationService.getTranslation(
            "infectious_status_must_be_confirmed_to_initialize_the_outbreak")
        );
      }

      // If create a new outbreak
      this.outbreak = new Outbreak({
        "infectiousAgent":INFECTIOUS_AGENT_CATEGORY[this.eventRequiringAttention.infectiousStatus.infectiousAgent],
        "criticity":OUTBREAK_CRITICITY.dont_know,
        "refTime":this.eventRequiringAttention.refTime
      });
      this.updateDisplayBooleans();

    } else if(changes.elementsRemoved.includes(RESPONSE_TYPE.declare_outbreak)){
      // Make sure that the outbreak is null if the user unchecks the box, we dont want to
      // hide the outbreak with wich the infectious status has alreaby been associated
      if (this.outbreak != null && this.outbreak.id == null) {
        this.outbreak = null;
      }
    }

    // ############## //
    // Confirm status //
    // ############## //
    if (changes.elementsAdded.includes(RESPONSE_TYPE.confirm)) {
      this.infectiousStatus.isConfirmed = true;
      this.updateInfectiousStatus();
    }

    // ############## //
    // Delete status //
    // ############## //
    if (changes.elementsAdded.includes(RESPONSE_TYPE.delete_infectious_status)) {
      this.confirmationService.confirm({
          target: event.target,
          message: this.translationService.getTranslation(
            "are_you_sure_you_want_to_delete_this_infectious_status"
          ),
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.deleteInfectiousStatus();
          },
          reject: () => {
            this.eventRequiringAttention.responsesTypes =
              this.eventRequiringAttention.responsesTypes.filter(
                x => x != RESPONSE_TYPE.delete_infectious_status
              )
          }
      });

    }

    // ################################################################## //
    // Associate infectious status to outbreaks component display boolean //
    // ################################################################## //
    if (changes.elementsAdded.includes(RESPONSE_TYPE.associate_to_existing_outbreak))
    {
      this.canDisplayAssociateInfectiousStatusToOutbreaksComponent = true;
    } else if(changes.elementsRemoved.includes(RESPONSE_TYPE.associate_to_existing_outbreak)){
      this.canDisplayAssociateInfectiousStatusToOutbreaksComponent = false;
    }

    // ############################## //
    // Isolation time display boolean //
    // ############################## //
    if (
      changes.elementsAdded.includes(RESPONSE_TYPE.isolation_in_same_unit)
      || changes.elementsAdded.includes(RESPONSE_TYPE.isolation_in_special_unit)
    ){
      this.canDisplayIsolationTime = true;
    } else if(
      changes.elementsRemoved.includes(RESPONSE_TYPE.isolation_in_same_unit)
      || changes.elementsRemoved.includes(RESPONSE_TYPE.isolation_in_special_unit)
    ){
      this.canDisplayIsolationTime = false;
    }

    // ################################ //
    // Request analysis display boolean //
    // ################################ //
    if (changes.elementsAdded.includes(RESPONSE_TYPE.request_analysis))
    {
      this.canDisplayRequestAnalysisComponent = true;
    } else if(changes.elementsRemoved.includes(RESPONSE_TYPE.request_analysis)){
      this.canDisplayRequestAnalysisComponent = false;
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

  setDebuggingComponentFlag() {
    if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[0].path == "debug1") {
      this.debugComponent = true;
    }
  }

  savePatientIsolationDate(){
    this.processingSavePatientIsolationDate = true;
    this.stayService.savePatientIsolationDateFromEventRequiringAttention(
      this.eventRequiringAttention,this.isolationTime
    ).subscribe(
      res => {
        this.processingSavePatientIsolationDate = false;
        if (res != null){
          console.log(res);
          this.notificationService.notifySuccess(
            this.translationService.getTranslation("isolation_date_updated")
          );
          this.responsesToEventCompIntService.announceIsolationTimeSaved();
        }
      }
    );
  }

  getPatientDecrypt() {
    this.patientService.getPatientDecrypt(this.infectiousStatus.patient).subscribe(res => {
      console.log("getPatientDecrypt1")
      if (res != null){
        console.log("getPatientDecrypt2")
        this.patientDecrypt = res;
        this.resourcesLoadedChecker.resourcesLoaded.patientDecrypt = true;
        this.updateResourcesLoaded();
      }
    });
  }

  showInfectiousStatusExplanation() {

    let patientId = this.infectiousStatus.patient.id;

    let dialogHeader = Utils.buildDialogHeaderForCallingComponent(
      this.patientDecrypt.firstname,
      this.patientDecrypt.lastname,
      new Date(this.patientDecrypt.birthdate),
      {
        history:this.translationService.getTranslation("history"),
        hospitalization_in_progress:
          this.translationService.getTranslation("hospitalization_in_progress")
      },
      this.locale,
      // rowData.current_unit_name,
      // rowData.patient_is_hospitalized,
    )

    const ref = this.dialogService.open(InfectiousStatusExplanationComponent, {
        data: {
          "patient": new Patient({id:patientId})
        },
        header: dialogHeader,
        width: '85%'
    });

  }

}
