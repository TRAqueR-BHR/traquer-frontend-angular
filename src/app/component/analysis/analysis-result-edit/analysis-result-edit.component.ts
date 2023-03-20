import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map, Observable, of, Subscription } from 'rxjs';
import { ANALYSIS_RESULT_VALUE_TYPE } from 'src/app/enum/ANALYSIS_RESULT_VALUE_TYPE';
import { SAMPLE_MATERIAL_TYPE } from 'src/app/enum/SAMPLE_MATERIAL_TYPE';
import { OUTBREAK_CRITICITY } from 'src/app/enum/OUTBREAK_CRITICITY';
import { PatientDecrypt } from 'src/app/model-protected/PatientDecrypt';
import { AnalysisResult } from 'src/app/model/AnalysisResult';
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

@Component({
  selector: 'app-analysis-result-edit',
  templateUrl: './analysis-result-edit.component.html',
  styleUrls: ['./analysis-result-edit.component.scss'],
  providers: [InfectiousStatusEditCompIntService]
})
export class AnalysisResultEditComponent implements OnInit {

  @Input()
  analysisResult:AnalysisResult;

  analysisRef:string;

  patientDecrypt:PatientDecrypt;

  patient:Patient;

  // Options
  optionsSAMPLE_MATERIAL_TYPE:SelectItem[] = [];
  optionsANALYSIS_RESULT_VALUE_TYPE:SelectItem[] = [];
  optionsANALYSIS_REQUEST_TYPE:SelectItem[] = [];
  optionsPatientStays:SelectItem[] = [];

  // Modes
  choosePatientAndCreateAnalysisResultMode:boolean = true;

  // Display booleans
  debug:boolean = false;
  patientPanelShouldAppear:boolean = false;
  patientSeachPanelCollapsed:boolean = false;
  analysisResultPanelCollapsed:boolean = false;

  // Resources loaded checker
  resourcesLoadedChecker = {
    resourcesAreLoaded: false,
    resourcesLoaded:{
      patient:false,
      patientStays:false
    }
  }

  // Observable subscriptions
  subscriptions: Subscription[] = [];

  constructor(
    private translationService:TranslationService,
    private route: ActivatedRoute,
    private outbreakService:OutbreakService,
    private analysisResultService:AnalysisService,
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
    this.getAnalysisResult();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  intializeAnalysisResult(patient:Patient){
    this.analysisResult = new AnalysisResult(
      {
        "patient":patient
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
          this.intializeAnalysisResult(this.patient);

          this.resourcesLoadedChecker.resourcesLoaded.patient = true;
          this.updateResourcesLoaded();

          this.prepareOptionsStays();

        }
      );
    this.subscriptions.push(subscription_patientSelected);

  }

  getAnalysisResult(){

    // If the infectious status is given as an input
    if (this.analysisResult != null) {
      return ;
    }

    // Get the event from the dialog input config if any
    if (this.dialogConfig != null
      && this.dialogConfig.data != null) {

        if (this.dialogConfig.data.new === true){
          this.choosePatientAndCreateAnalysisResultMode = true;
          this.updateDisplayBooleans();
          return;
        } else {
          // TODO
        }
        return ;
    }

    // If debug get the infectious status from the url
    if (this.debug){

      if (this.route.snapshot.paramMap.get('analysisResultId') == "new"){
        this.choosePatientAndCreateAnalysisResultMode = true;
        this.updateDisplayBooleans();
        return;
      }

      // TODO
      // this.getAnalysisResultFromURL().subscribe(res => {
      //   console.log(res);
      //   if (res != null){
      //     this.analysisResult = res;
      //   }
      // })
    }

  }

  // getAnalysisResultFromURL():Observable<AnalysisResult>{
  //   const id = this.route.snapshot.paramMap.get('analysisResultId');

  //   return this.analysisResultService.getAnalysisResultFromAnalysisResultFilter(
  //     new AnalysisResult({"id":id}),true
  //   ).pipe(map(res => {
  //     if (res != null){
  //       return res[0];
  //     } else {
  //       return null
  //     }
  //   }));

  // }

  getPatient(){
    this.patientService.getPatientDecrypt(this.analysisResult.patient).subscribe(
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
    this.analysisResultService.upsert(this.analysisResult, this.analysisRef)
    .subscribe(res => {
      if (res != null){
        this.analysisResult = res;
        this.notificationService.notifySuccess(
          this.translationService.getTranslation("infectious_status_updated"));
        }
        this.dialogRef.close();
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

  prepareOptionsStays(){
    let stayFilter = new Stay({
      patient:this.patient
    });
    this.stayService.geStayFromStayFilter(stayFilter, true).subscribe(res =>{

      if (res != null){

        let options:SelectItem[] = [];

        options.push({
          value: null,
          label: this.translationService.getTranslation("null_option_label")
        });

        for (let s of res){

          let inTimeStr = formatDate(
            s.inTime,
            environment.datetime_format,
            this.locale
          );
          let outTimeStr = s.outTime != null ?
            formatDate(s.outTime,environment.datetime_format,this.locale) : "";

          options.push({
            value: s,
            label: `${s.unit.name} ${inTimeStr} ⟶ ${outTimeStr}`
          });
        }
        this.optionsPatientStays = options;
      }

      this.resourcesLoadedChecker.resourcesLoaded.patientStays = true;
      this.updateResourcesLoaded();

    });
  }


  updateDisplayBooleans(){

    if (this.choosePatientAndCreateAnalysisResultMode) {
      this.patientPanelShouldAppear = true;
      // If no patient selected yet, unfold the panel for choosing one and fold the panel for
      //   editing the infectious status itself
      if (this.patientDecrypt == null){
        this.patientSeachPanelCollapsed = false;
        this.analysisResultPanelCollapsed = true;
      } else {
        this.patientSeachPanelCollapsed = true;
        this.analysisResultPanelCollapsed = false;
      }
    }

  }

  setDebuggingComponentFlag() {
    if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[0].path == "debug10") {
      this.debug = true;
    }
  }

}
