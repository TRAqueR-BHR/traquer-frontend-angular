import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map, Observable, of, Subscription } from 'rxjs';
import { INFECTIOUS_AGENT_CATEGORY } from 'src/app/enum/INFECTIOUS_AGENT_CATEGORY';
import { INFECTIOUS_STATUS_TYPE } from 'src/app/enum/INFECTIOUS_STATUS_TYPE';
import { OUTBREAK_CRITICITY } from 'src/app/enum/OUTBREAK_CRITICITY';
import { PatientDecrypt } from 'src/app/model-protected/PatientDecrypt';
import { InfectiousStatus } from 'src/app/model/InfectiousStatus';
import { Patient } from 'src/app/model/Patient';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { InfectiousStatusEditCompIntService } from 'src/app/service/components-interaction/infectious-status-edit-comp-int.service';
import { EnumService } from 'src/app/service/enum.service';
import { InfectiousStatusService } from 'src/app/service/infectious-status.service';
import { OutbreakService } from 'src/app/service/outbreak.service';
import { PatientService } from 'src/app/service/patient.service';
import { SelectItemService } from 'src/app/service/select-item.service';
import { UINotificationService } from 'src/app/service/uinotification.service';

@Component({
  selector: 'app-infectious-status-edit',
  templateUrl: './infectious-status-edit.component.html',
  styleUrls: ['./infectious-status-edit.component.scss'],
  providers: [InfectiousStatusEditCompIntService]
})
export class InfectiousStatusEditComponent implements OnInit {

  @Input()
  infectiousStatus:InfectiousStatus;

  patientDecrypt:PatientDecrypt;

  patient:Patient;

  // Options
  optionsINFECTIOUS_STATUS_TYPE:SelectItem[] = [];
  optionsINFECTIOUS_AGENT_CATEGORY:SelectItem[] = [];

  // Modes
  choosePatientAndCreateInfectiousStatusMode:boolean = true;

  // Display booleans
  debug:boolean = false;
  patientPanelShouldAppear:boolean = false;
  patientSeachPanelCollapsed:boolean = false;
  infectiousStatusPanelCollapsed:boolean = false;

  // Resources loaded checker
  resourcesLoadedChecker = {
    resourcesAreLoaded: false,
    resourcesLoaded:{
      patient:false
    }
  }

  // Observable subscriptions
  subscriptions: Subscription[] = [];

  constructor(
    private translationService:TranslationService,
    private route: ActivatedRoute,
    private outbreakService:OutbreakService,
    private infectiousStatusService:InfectiousStatusService,
    private enumService:EnumService,
    private selectItemService:SelectItemService,
    private patientService: PatientService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    public notificationService:UINotificationService,
    private infectiousStatusEditCompIntService:InfectiousStatusEditCompIntService
  ) {
    this.createSubscriptions();
  }

  ngOnInit(): void {
    this.prepareOptionsINFECTIOUS_STATUS_TYPE();
    this.prepareOptionsINFECTIOUS_AGENT_CATEGORY();
    this.setDebuggingComponentFlag();
    this.getInfectiousStatus();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  intializeInfectiousStatus(patient:Patient){
    this.infectiousStatus = new InfectiousStatus(
      {
        "patient":patient,
        "isCurrent":false,
        "isConfirmed":false
      }
    );
  }

  createSubscriptions() {

    const subscription_patientSelected =
      this.infectiousStatusEditCompIntService.patientSelected$.subscribe(
        res => {
          this.patientDecrypt = res;
          console.log(this.patientDecrypt);
          this.patient = new Patient(
            {
              id:this.patientDecrypt.patientId
            }
          );
          this.intializeInfectiousStatus(this.patient);
          this.resourcesLoadedChecker.resourcesLoaded.patient = true;
          this.updateResourcesLoaded();
        }
      );
    this.subscriptions.push(subscription_patientSelected);

  }

  getInfectiousStatus(){

    // If the infectious status is given as an input
    if (this.infectiousStatus != null) {
      return ;
    }

    // Get the event from the dialog input config if any
    if (this.dialogConfig != null
      && this.dialogConfig.data != null) {

        if (this.dialogConfig.data.new === true){
          this.choosePatientAndCreateInfectiousStatusMode = true;
          this.updateDisplayBooleans();
          return;
        } else {
          // TODO
        }
        return ;
    }

    // If debug get the infectious status from the url
    if (this.debug){

      if (this.route.snapshot.paramMap.get('infectiousStatusId') == "new"){
        this.choosePatientAndCreateInfectiousStatusMode = true;
        this.updateDisplayBooleans();
        return;
      }

      this.getInfectiousStatusFromURL().subscribe(res => {
        console.log(res);
        if (res != null){
          this.infectiousStatus = res;
        }
      })
    }

  }

  getInfectiousStatusFromURL():Observable<InfectiousStatus>{
    const id = this.route.snapshot.paramMap.get('infectiousStatusId');

    return this.infectiousStatusService.geInfectiousStatusFromInfectiousStatusFilter(
      new InfectiousStatus({"id":id}),true
    ).pipe(map(res => {
      if (res != null){
        return res[0];
      } else {
        return null
      }
    }));

  }

  getPatient(){
    this.patientService.getPatientDecrypt(this.infectiousStatus.patient).subscribe(
      res => {
        if (res != null){
          this.patientDecrypt = res;
        }
      }
    )
  }

  updateResourcesLoaded():void {
    for (let k in this.resourcesLoadedChecker) {
      // console.log(this.resourcesLoadedChecker[k]);
      if (this.resourcesLoadedChecker[k] instanceof Object) {
        for (let ksub in this.resourcesLoadedChecker[k]) {
          if (this.resourcesLoadedChecker[k][ksub] == false) {
            this.resourcesLoadedChecker.resourcesAreLoaded = false;
            // console.log(`${ksub} is false`);
            return;
          }
        }
      }
    }
    this.resourcesLoadedChecker.resourcesAreLoaded = true;
    this.updateDisplayBooleans();
  }

  save(){
    this.infectiousStatusService.upsert(this.infectiousStatus).subscribe(res => {
      if (res != null){
        this.infectiousStatus = res;
        this.notificationService.notifySuccess(
          this.translationService.getTranslation("infectious_status_updated"));
        }
        this.dialogRef.close();
    });
  }

  prepareOptionsINFECTIOUS_STATUS_TYPE() {
    this.enumService.listAllPossibleValues(INFECTIOUS_STATUS_TYPE).subscribe(
      res => {
          this.optionsINFECTIOUS_STATUS_TYPE =
            this.selectItemService.createSelectItemsForEnums(
              res,
              INFECTIOUS_STATUS_TYPE,
              true, // null options
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
              true, // null options
              );
      }
    );
  }

  updateDisplayBooleans(){

    if (this.choosePatientAndCreateInfectiousStatusMode) {
      this.patientPanelShouldAppear = true;
      // If no patient selected yet, unfold the panel for choosing one and fold the panel for
      //   editing the infectious status itself
      if (this.patientDecrypt == null){
        this.patientSeachPanelCollapsed = false;
        this.infectiousStatusPanelCollapsed = true;
      } else {
        this.patientSeachPanelCollapsed = true;
        this.infectiousStatusPanelCollapsed = false;
      }
    }

  }

  setDebuggingComponentFlag() {
    if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[0].path == "debug8") {
      this.debug = true;
    }
  }

}
