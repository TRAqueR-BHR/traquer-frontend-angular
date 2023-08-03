import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map, Observable, of, Subscription } from 'rxjs';
import { Patient } from 'src/app/model/Patient';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { InfectiousStatusEditCompIntService } from 'src/app/service/components-interaction/infectious-status-edit-comp-int.service';
import { EnumService } from 'src/app/service/enum.service';
import { InfectiousStatusService } from 'src/app/service/infectious-status.service';
import { OutbreakService } from 'src/app/service/outbreak.service';
import { PatientService } from 'src/app/service/patient.service';
import { SelectItemService } from 'src/app/service/select-item.service';
import { UINotificationService } from 'src/app/service/uinotification.service';
import { Stay } from 'src/app/model/Stay';
import { PatientDecrypt } from 'src/app/model-protected/PatientDecrypt';
import { StayService } from 'src/app/service/stay.service';
import { UnitService } from 'src/app/service/unit.service';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stay-edit',
  templateUrl: './stay-edit.component.html',
  styleUrls: ['./stay-edit.component.scss']
})
export class StayEditComponent implements OnInit {

  @Input() stay:Stay;
  patientDecrypt:PatientDecrypt;

  patient:Patient;

  // Options
  optionsUnits:SelectItem[] = [];
  optionsExistingHospitalizations:SelectItem[] = [];

  // Modes
  choosePatientAndCreateStayMode:boolean = true;

  // Display booleans
  debug:boolean = false;
  patientPanelShouldAppear:boolean = false;
  patientSeachPanelCollapsed:boolean = false;
  stayPanelCollapsed:boolean = false;
  processing:boolean = false;

  // Resources loaded checker
  resourcesLoadedChecker = {
    resourcesAreLoaded: false,
    resourcesLoaded:{
      patient:false,
      units:false,
      existingHospitalizationsDates:false
    }
  }

  // Observable subscriptions
  subscriptions: Subscription[] = [];

  constructor(
    private translationService:TranslationService,
    private route: ActivatedRoute,
    private outbreakService:OutbreakService,
    private stayService:StayService,
    private enumService:EnumService,
    private selectItemService:SelectItemService,
    private patientService: PatientService,
    private unitService: UnitService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    public notificationService:UINotificationService,
    private infectiousStatusEditCompIntService:InfectiousStatusEditCompIntService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.createSubscriptions();
  }

  ngOnInit(): void {
    this.prepareOptionsUnits();
    this.setDebuggingComponentFlag();
    this.getStay();
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
          this.intializeStay(this.patient);
          this.resourcesLoadedChecker.resourcesLoaded.patient = true;
          this.updateResourcesLoaded();
          this.prepareOptionsExistingHospitalizations();
        }
      );
    this.subscriptions.push(subscription_patientSelected);

  }

  prepareOptionsUnits(){
    this.unitService.getAllUnits(false).subscribe(res =>{

      if (res != null){
        this.optionsUnits = this.selectItemService.createSelectItemsForEntities(
          res,
          null, // no value property, use the entity itself
          "name"
        );
      }

      this.resourcesLoadedChecker.resourcesLoaded.units = true;
      this.updateResourcesLoaded();

    });
  }

  prepareOptionsExistingHospitalizations(){

    if (this.patient == null) {
      return;
    }

    this.stayService.getPatientHospitalizationsDates(this.patient).subscribe(res =>{

      if (res != null){
        console.log(res);
        this.optionsExistingHospitalizations = [];
        this.optionsExistingHospitalizations.push({
          value: null,
          label: this.translationService.getTranslation("null_option_label")
        });
        for (let r of res){
          let hospitalizationInTime = new Date(r.hospitalization_in_time);
          let hospitalizationOutTime = r.hospitalization_out_time == null ?
            null : new Date(r.hospitalization_out_time);
          let label = formatDate(
            hospitalizationInTime,
            environment.datetime_format,
            this.locale
          );
          if (hospitalizationOutTime != null){
            label += ` ⟶ ${
              formatDate(
              hospitalizationOutTime,
              environment.datetime_format,
              this.locale
            )}`
          }
          this.optionsExistingHospitalizations.push({
            value: {
              hospitalizationInTime: hospitalizationInTime,
              hospitalizationOutTime: hospitalizationOutTime
            },
            label: label
          });
        }

      }

      this.resourcesLoadedChecker.resourcesLoaded.existingHospitalizationsDates = true;
      this.updateResourcesLoaded();

    });
  }

  intializeStay(patient:Patient){
    this.stay = new Stay(
      {
        "patient":patient
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
    this.stayService.upsert(this.stay).subscribe(res => {
      this.processing = false;
      if (res != null){
        this.stay = res;
        this.notificationService.notifySuccess(
          this.translationService.getTranslation("stay_updated"));
        }
        this.dialogRef.close();
    });
  }

  updateDisplayBooleans(){

    if (this.choosePatientAndCreateStayMode) {
      this.patientPanelShouldAppear = true;
      // If no patient selected yet, unfold the panel for choosing one and fold the panel for
      //   editing the infectious status itself
      if (this.patientDecrypt == null){
        this.patientSeachPanelCollapsed = false;
        this.stayPanelCollapsed = true;
      } else {
        this.patientSeachPanelCollapsed = true;
        this.stayPanelCollapsed = false;
      }
    }

  }

  setDebuggingComponentFlag() {
    if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[0].path == "debug9") {
      this.debug = true;
    }
  }


  getStay(){

    // If the stay is given as an input
    if (this.stay != null) {
      return ;
    }

    // Get the event from the dialog input config if any
    if (this.dialogConfig != null
      && this.dialogConfig.data != null) {

        if (this.dialogConfig.data.new === true){
          this.choosePatientAndCreateStayMode = true;
          this.updateDisplayBooleans();
          return;
        } else {
          // TODO
        }
        return ;
    }

    // If debug get the infectious status from the url
    if (this.debug){

      if (this.route.snapshot.paramMap.get('stayId') == "new"){
        this.choosePatientAndCreateStayMode = true;
        this.updateDisplayBooleans();
        return;
      }

      this.getStayFromURL().subscribe(res => {
        console.log(res);
        if (res != null){
          this.stay = res;
        }
      })
    }

  }

  handleChangeOnSelectedExistingHospitalization(event){
    this.stay.hospitalizationInTime = event.value.hospitalizationInTime;
    this.stay.hospitalizationOutTime = event.value.hospitalizationOutTime;
  }

  getStayFromURL():Observable<Stay>{
    const id = this.route.snapshot.paramMap.get('stayId');

    return this.stayService.geStayFromStayFilter(
      new Stay({"id":id}),true
    ).pipe(map(res => {
      if (res != null){
        return res[0];
      } else {
        return null
      }
    }));

  }


}
