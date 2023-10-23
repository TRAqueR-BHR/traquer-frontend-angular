import { Component, Inject, Input, LOCALE_ID, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map, Observable, of, Subscription } from 'rxjs';
import { ANALYSIS_RESULT_VALUE_TYPE } from 'src/app/enum/ANALYSIS_RESULT_VALUE_TYPE';
import { SAMPLE_MATERIAL_TYPE } from 'src/app/enum/SAMPLE_MATERIAL_TYPE';
import { OUTBREAK_CRITICITY } from 'src/app/enum/OUTBREAK_CRITICITY';
import { PatientDecrypt } from 'src/app/model-protected/PatientDecrypt';
import { AnalysisRequest } from 'src/app/model/AnalysisRequest';
import { Patient } from 'src/app/model/Patient';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { EnumService } from 'src/app/service/enum.service';
import { AnalysisService } from 'src/app/service/analysis.service';
import { OutbreakService } from 'src/app/service/outbreak.service';
import { PatientService } from 'src/app/service/patient.service';
import { SelectItemService } from 'src/app/service/select-item.service';
import { UINotificationService } from 'src/app/service/uinotification.service';
import { InfectiousStatusEditCompIntService } from 'src/app/service/components-interaction/infectious-status-edit-comp-int.service';
import { ANALYSIS_REQUEST_TYPE } from 'src/app/enum/ANALYSIS_REQUEST_TYPE';
import { StayService } from 'src/app/service/stay.service';
import { Stay } from 'src/app/model/Stay';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AnalysisRequestService } from 'src/app/service/analysis-request.service';
import { Unit } from 'src/app/model/Unit';
import { ANALYSIS_REQUEST_STATUS_TYPE } from 'src/app/enum/ANALYSIS_REQUEST_STATUS_TYPE';

@Component({
  selector: 'app-analysis-request-edit',
  templateUrl: './analysis-request-edit.component.html',
  styleUrls: ['./analysis-request-edit.component.scss']
})
export class AnalysisRequestEditComponent implements OnInit {

  @Input()
  analysisRequest:AnalysisRequest;

  @Input()
  patient:Patient;

  @Input()
  patientDecrypt:PatientDecrypt;

  analysisRef:string;

  // Options
  optionsSAMPLE_MATERIAL_TYPE:SelectItem[] = [];
  optionsANALYSIS_RESULT_VALUE_TYPE:SelectItem[] = [];
  optionsANALYSIS_REQUEST_TYPE:SelectItem[] = [];
  optionsPatientUnits:SelectItem[] = [];

  // Modes
  choosePatientAndCreateAnalysisRequestMode:boolean = true;

  // Display booleans
  debugComponent:boolean = false;
  patientPanelShouldAppear:boolean = false;
  patientSeachPanelCollapsed:boolean = false;
  analysisRequestPanelCollapsed:boolean = false;
  processing:boolean = false;
  loadingUnits:boolean = true;

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
    private analysisRequestService:AnalysisRequestService,
    private enumService:EnumService,
    private selectItemService:SelectItemService,
    private patientService: PatientService,
    private stayService: StayService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    public notificationService:UINotificationService,
    private infectiousStatusEditCompIntService:InfectiousStatusEditCompIntService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.createSubscriptions();
  }

  ngOnInit(): void {
    this.prepareOptionsSAMPLE_MATERIAL_TYPE();
    this.prepareOptionsANALYSIS_RESULT_VALUE_TYPE();
    this.prepareOptionsANALYSIS_REQUEST_TYPE();
    this.setDebuggingComponentFlag();
    this.getAnalysisRequest();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['patient']) {
      this.intializeAnalysisRequest(this.patient);
      this.prepareForm();
    }
  }

  intializeAnalysisRequest(patient:Patient){
    this.analysisRequest = new AnalysisRequest(
      {
        "patient":patient,
        "status":ANALYSIS_REQUEST_STATUS_TYPE.requested,
      }
    );
  }

  prepareForm(){
    this.prepareOptionsUnits();
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
          this.intializeAnalysisRequest(this.patient);

          this.resourcesLoadedChecker.resourcesLoaded.patient = true;
          this.updateResourcesLoaded();

          this.prepareForm();

        }
      );
    this.subscriptions.push(subscription_patientSelected);

  }

  getAnalysisRequest(){

    // If the infectious status is given as an input
    if (this.analysisRequest != null) {
      return ;
    }

    // Get the event from the dialog input config if any
    if (this.dialogConfig != null
      && this.dialogConfig.data != null) {

        if (this.dialogConfig.data.new === true){
          this.choosePatientAndCreateAnalysisRequestMode = true;
          this.updateDisplayBooleans();
          return;
        } else {
          // TODO
        }
        return ;
    }

    // If debug get the infectious status from the url
    if (this.debugComponent){

      if (this.route.snapshot.paramMap.get('analysisRequestId') == "new"){
        this.choosePatientAndCreateAnalysisRequestMode = true;
        this.updateDisplayBooleans();
        return;
      }

      // TODO
      // this.getAnalysisRequestFromURL().subscribe(res => {
      //   console.log(res);
      //   if (res != null){
      //     this.analysisResult = res;
      //   }
      // })
    }

  }

  // getAnalysisRequestFromURL():Observable<AnalysisRequest>{
  //   const id = this.route.snapshot.paramMap.get('analysisResultId');

  //   return this.analysisResultService.getAnalysisRequestFromAnalysisRequestFilter(
  //     new AnalysisRequest({"id":id}),true
  //   ).pipe(map(res => {
  //     if (res != null){
  //       return res[0];
  //     } else {
  //       return null
  //     }
  //   }));

  // }

  getPatient(){
    this.patientService.getPatientDecrypt(this.analysisRequest.patient).subscribe(
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
    this.processing = true;
    this.analysisRequestService.save(this.analysisRequest)
    .subscribe(res => {
      this.processing = false;
      if (res != null){
        this.analysisRequest = res;
        this.notificationService.notifySuccess(
          this.translationService.getTranslation("analysis_request_saved"));
        }
    });
  }

  prepareOptionsSAMPLE_MATERIAL_TYPE() {
    this.enumService.listAllPossibleValues(SAMPLE_MATERIAL_TYPE).subscribe(
      res => {
          this.optionsSAMPLE_MATERIAL_TYPE =
            this.selectItemService.createSelectItemsForEnums(
              res,
              SAMPLE_MATERIAL_TYPE,
              true, // null options
              );
      }
    );
  }

  prepareOptionsANALYSIS_RESULT_VALUE_TYPE() {
    this.enumService.listAllPossibleValues(ANALYSIS_RESULT_VALUE_TYPE).subscribe(
      res => {
          this.optionsANALYSIS_RESULT_VALUE_TYPE =
            this.selectItemService.createSelectItemsForEnums(
              res,
              ANALYSIS_RESULT_VALUE_TYPE,
              true, // null options
              "ANALYSIS_RESULT_VALUE_TYPE_"
            );
      }
    );
  }

  prepareOptionsANALYSIS_REQUEST_TYPE() {
    this.enumService.listAllPossibleValues(ANALYSIS_REQUEST_TYPE).subscribe(
      res => {
          this.optionsANALYSIS_REQUEST_TYPE =
            this.selectItemService.createSelectItemsForEnums(
              res,
              ANALYSIS_REQUEST_TYPE,
              true, // null options
              );
      }
    );
  }

  prepareOptionsUnits(){

    this.loadingUnits = true;

    this.optionsPatientUnits = [];

    let stayFilter = new Stay({
      patient:this.patient
    });
    console.log(this.patient);
    this.stayService.geStayFromStayFilter(stayFilter, true).subscribe(res =>{

      this.loadingUnits = false;

      if (res != null){

        // Get the list of distinct units
        let units:Unit[] = [];
        for (let stay of res){
          // Is the unit of that stay has not been added to the list of units, add it
          if (units.map(u => u.id).indexOf(stay.unit.id) == -1){
            units.push(stay.unit);
          }
        }

        this.optionsPatientUnits = this.selectItemService.createSelectItemsForEntities(
          units,
          null, // value property
          "name", // labelProperty: string,
          false, // translate: boolean = false,
          false, // includeNullOption:boolean = false
        );
      }

    });
  }


  updateDisplayBooleans(){

    if (this.choosePatientAndCreateAnalysisRequestMode) {
      this.patientPanelShouldAppear = true;
      // If no patient selected yet, unfold the panel for choosing one and fold the panel for
      //   editing the infectious status itself
      if (this.patientDecrypt == null){
        this.patientSeachPanelCollapsed = false;
        this.analysisRequestPanelCollapsed = true;
      } else {
        this.patientSeachPanelCollapsed = true;
        this.analysisRequestPanelCollapsed = false;
      }
    }

  }

  setDebuggingComponentFlag() {
    if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[0].path == "debug14") {
      this.debugComponent = true;
    }
  }

}
