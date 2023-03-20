import { Component, OnInit, ViewEncapsulation, Input, Pipe, PipeTransform, ViewChild } from '@angular/core';
import {Patient} from 'src/app/model/Patient';
import {PatientService} from 'src/app/service/patient.service';
import {GENDER} from 'src/app/enum/GENDER';
import {EnumService} from 'src/app/service/enum.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UINotificationService } from 'src/app/service/uinotification.service';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-patient-editor',
  templateUrl: './patient-editor.component.html',
  styleUrls: ['./patient-editor.component.scss']
})
export class PatientEditorComponent implements OnInit {


  @ViewChild(NgForm) form:NgForm;

  @Input() patient :Patient;
  @Input() displayMode:string;

  firstname: string;
  lastname: string;
  birthdate:Date;

  // Display booleans
  debug = false; isLocked = false;
  firstnameWriteMode = false;
  lastnameWriteMode = false;
  birthdateWriteMode = false;
  canDisplayGeneralSaveBtn = false
  canDisplayFirstnameEditBtn = false;
  canDisplayLastnameEditBtn = false;
  canDisplayBirthDateEditBtn = false;
  canDisplayFirstnameSaveBtn = false;
  canDisplayLastnameSaveBtn = false;
  canDisplayBirthDateSaveBtn = false;
  isDisplayedAsDialog = false;
  savingInProgress = false;

  primengCalendarFrenchTranslation: any;

  constructor(private patientService: PatientService,
              private enumService: EnumService,
              private notificationsService: UINotificationService,
              private router: Router,
              private route: ActivatedRoute,
              private translationService:TranslationService,
              public dynamicDialogRef: DynamicDialogRef,
              public dynamicDialogConfig: DynamicDialogConfig
              ) {

        // This ensures that the page will be refreshed when redirecting to the
        // '/patient/XX' after a new patient has been saved
        this.router.routeReuseStrategy.shouldReuseRoute = function(){
            return false;
        }
  }

  ngOnInit() {
    console.log(`this.dynamicDialogConfig == null[${this.dynamicDialogConfig.data == null}]`)
    if (this.dynamicDialogConfig.data != null && this.dynamicDialogConfig.data.asDialog) {
      this.isDisplayedAsDialog = true;
      this.displayMode = "patient";
    }
    this.setDebuggingComponentFlag();
    this.primengCalendarFrenchTranslation = this.translationService.getTranslationForPrimengCalendar();
    this.getPatient();
  }


  handleClickOnFirstnameEditBtn(evt){
    this.firstnameWriteMode = true;
    this.updateDisplayBooleans();
  }

  handleClickOnFirstnameSaveBtn(evt){
    this.firstnameWriteMode = false;
    this.updateDisplayBooleans();
    this.save();
  }

  handleClickOnLastnameEditBtn(evt){
    this.lastnameWriteMode = true;
    this.updateDisplayBooleans();
  }

  handleClickOnLastnameSaveBtn(evt){
    this.lastnameWriteMode = false;
    this.updateDisplayBooleans();
    this.save();
  }

  handleClickOnBirthDateEditBtn(evt){
    this.birthdateWriteMode = true;
    this.updateDisplayBooleans();
  }

  handleClickOnBirthDateSaveBtn(evt){
    this.birthdateWriteMode = false;
    this.updateDisplayBooleans();
    this.save();
  }

  setDebuggingComponentFlag() {
    if (this.route.snapshot != null
      && this.route.snapshot.url != null
      && this.route.snapshot.url.length > 0
      && this.route.snapshot.url[0].path == "debug") {
      this.debug = true;
      this.displayMode = "patient";
    }
    this.updateDisplayBooleans();
  }

  updateDisplayBooleans() {
    if (this.displayMode == "patient") {
      this.canDisplayGeneralSaveBtn = true;
      this.firstnameWriteMode = true;
      this.lastnameWriteMode = true;
      this.birthdateWriteMode = true;
      this.canDisplayFirstnameEditBtn = false;
      this.canDisplayLastnameEditBtn = false;
      this.canDisplayBirthDateEditBtn = false;
      this.canDisplayFirstnameSaveBtn = false;
      this.canDisplayLastnameSaveBtn = false;
      this.canDisplayBirthDateSaveBtn = false;
    } else {
      this.canDisplayGeneralSaveBtn = false;

      this.canDisplayFirstnameEditBtn = !this.firstnameWriteMode;
      this.canDisplayFirstnameSaveBtn = this.firstnameWriteMode;

      this.canDisplayLastnameEditBtn = !this.lastnameWriteMode;
      this.canDisplayLastnameSaveBtn = this.lastnameWriteMode;

      this.canDisplayBirthDateEditBtn = !this.birthdateWriteMode;
      this.canDisplayBirthDateSaveBtn = this.birthdateWriteMode;
    }
  }

  getPatient() {
    // In debug mode, the exam is not passed by the parent component.
    //   Need to retrieve it from the URL
    if (this.patient == null) {
      const patientId = this.route.snapshot.paramMap.get('id');
      this.patient = new Patient({id: patientId});
      this.getPatientDecryptedInfoFromId();
    } else {
      this.getPatientDecryptedInfoFromId();
    }
  }

  getPatientDecryptedInfoFromId() {

    // Handle the case where this component is used in the context of creating a new patient
    if (this.patient.id == null) {
      return;
    }

    this.patientService.getPatientDecryptedInfoFromId(this.patient.id).subscribe(res => {
      if (res != null) {
        console.log(res);
        this.firstname = res.firstname;
        this.lastname = res.lastname;
        this.birthdate = new Date(res.birthdate);
      }
    });
  }

  checkFormValidity():boolean {
      return this.form.valid;
    }

  save(withNotification:boolean = true) {


    // If it is a new patient, create it
    if (this.patient.id == null) {

      this.savingInProgress = true;

      this.patientService.create(
        this.firstname,
        this.lastname,
        this.birthdate).subscribe(result => {

          this.savingInProgress = false;

        if (result != null) {
            this.patient = result;

            if (withNotification) {
              this.notificationsService.notifySuccess(
                this.translationService.getTranslation("saved"));
            }

            // Either tedirect to the url with the patient id or close the dialog
            if (this.isDisplayedAsDialog == false) {
              this.router.navigate(['/patient', this.patient.id]);
            } else {
              this.dynamicDialogRef.close(this.patient);
            }

        }
      });
    } else {

      this.savingInProgress = true;

      this.patientService.updatePatientNameAndBirthdate(
        this.patient,
        this.firstname,
        this.lastname,
        this.birthdate).subscribe(result => {

        this.savingInProgress = false;

        if (withNotification) {
          this.notificationsService.notifySuccess(
            this.translationService.getTranslation("saved"));
        }

        if (result != null) {
            this.patient = result;
        }
      });
    }

  }

}
