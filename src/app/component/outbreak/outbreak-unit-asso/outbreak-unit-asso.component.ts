import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { INFECTIOUS_STATUS_TYPE } from 'src/app/enum/INFECTIOUS_STATUS_TYPE';
import { OutbreakUnitAsso } from 'src/app/model/OutbreakUnitAsso';
import { Stay } from 'src/app/model/Stay';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { ProcessingAnimComponent } from 'src/app/module/processing-animation/component/processing-anim/processing-anim.component';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { ContactExposureService } from 'src/app/service/contact-exposure.service';
import { StayService } from 'src/app/service/stay.service';
import { UINotificationService } from 'src/app/service/uinotification.service';
import { environment } from 'src/environments/environment';
import { InfectiousStatusExplanationComponent } from '../../infectious-status/infectious-status-explanation/infectious-status-explanation.component';
import { Patient } from 'src/app/model/Patient';
import { DialogService } from 'primeng/dynamicdialog';
import { OutbreakUnitAssoService } from 'src/app/service/outbreak-unit-asso.service';
import { Subscription } from 'rxjs';
import { ResponsesToEventCompIntService } from 'src/app/service/components-interaction/responses-to-event-comp-int.service';

@Component({
  selector: 'app-outbreak-unit-asso,[app-outbreak-unit-asso]',
  templateUrl: './outbreak-unit-asso.component.html',
  styleUrls: ['./outbreak-unit-asso.component.scss']
})
export class OutbreakUnitAssoComponent implements OnInit {

  @Input()
  outbreakUnitAsso:OutbreakUnitAsso;

  @ViewChild('simulateExposuresLoader')
  simulateExposuresLoader: ProcessingAnimComponent;

  carriersStaysForListing:any[] = [];
  contactsStaysForListing:any[] = [];
  optionsYesNo:SelectItem[] = [];

  numberOfContactExposures:number;
  saving:boolean = false;
  isDebugMode:boolean = false;

  // Display booleans
  processingExposuresSimulation:boolean = false;
  loadingCarriers:boolean = false;
  loadingContacts:boolean = false;

  // Observable subscriptions
  subscriptions: Subscription[] = [];

  constructor(
    private stayService:StayService,
    private translationService:TranslationService,
    private contactExposureService:ContactExposureService,
    private notificationService:UINotificationService,
    private authenticationService:AuthenticationService,
    private dialogService:DialogService,
    private outbreakUnitAssoService:OutbreakUnitAssoService,
    private responsesToEventCompIntService:ResponsesToEventCompIntService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.createSubscriptions();
  }

  ngOnInit(): void {
    this.getOptionsYesNo();
    this.getCarriersStaysFromOutbreakUnitAsso();
    this.getContactsStaysFromOutbreakUnitAsso();
    this.simulateContactExposures();
    this.isDebugMode = this.authenticationService.isDebugMode();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  createSubscriptions() {

    // When an isolation time (and the contacts refreshed) we want to refresh the contacts
    // table and also the carriers table (to show the update to the isolation time column)
    const subscriptionToIsolationTimeSaved =
      this.responsesToEventCompIntService.isolationTimeSaved$.subscribe(
        bool => {
          console.log("isolationTimeSaved$");
          this.getCarriersStaysFromOutbreakUnitAsso();
          this.getContactsStaysFromOutbreakUnitAsso();
        }
      );
    this.subscriptions.push(subscriptionToIsolationTimeSaved);

  }

  getCarriersStaysFromOutbreakUnitAsso(){
    this.loadingCarriers = true;
    this.stayService.getCarriersOrContactsStaysForListingFromOutbreakUnitAsso(
      this.outbreakUnitAsso,
      INFECTIOUS_STATUS_TYPE.carrier
    )
    .subscribe(res => {
      this.loadingCarriers = false;
      if (res != null) {
        this.carriersStaysForListing = res;
      }
    });
  }

  getContactsStaysFromOutbreakUnitAsso(){
    this.loadingContacts = true;
    this.stayService.getCarriersOrContactsStaysForListingFromOutbreakUnitAsso(
      this.outbreakUnitAsso,
      INFECTIOUS_STATUS_TYPE.contact
    )
    .subscribe(res => {
      this.loadingContacts = false;
      if (res != null) {
        console.log(res);
        this.contactsStaysForListing = res;
      }
    });
  }

  getOptionsYesNo() {
    this.optionsYesNo = [];
    this.optionsYesNo.push(
      {label: this.translationService.getTranslation("true"), value: true}
    );
    this.optionsYesNo.push(
      {label: this.translationService.getTranslation("false"), value: false}
    );
  }

  simulateContactExposures() {
    // this.simulateExposuresLoader.visible = true;
    this.processingExposuresSimulation = true;
    this.contactExposureService.simulateContactExposures(this.outbreakUnitAsso)
      .subscribe(res => {
        this.processingExposuresSimulation = false;
        if (res != null){
          this.numberOfContactExposures = res.length;
        }
      })
  }

  generateContactExposuresAndInfectiousStatuses() {
    this.saving = true;
    this.outbreakUnitAssoService.updateAssoAndRefreshExposuresAndContactStatuses(this.outbreakUnitAsso)
      .subscribe(res => {
        if (res != null){
          this.saving = false;
          this.getContactsStaysFromOutbreakUnitAsso();
          this.notificationService.notifySuccess(
            this.translationService.getTranslation("contact_cases_generated"));
        }
      })
  }


  showInfectiousStatusExplanation(patientId:string) {

    // let formatedDate = formatDate(rowData.birthdate,environment.date_format,this.locale)

    // let dialogHeader = `
    //   ${this.translationService.getTranslation("history")}
    //   ${rowData.firstname} ${rowData.lastname} ${formatedDate}
    // `;

    let dialogHeader = ``;

    const ref = this.dialogService.open(InfectiousStatusExplanationComponent, {
        data: {
          "patient": new Patient({id:patientId})
        },
        header: dialogHeader,
        width: '85%'
    });
  }

}
