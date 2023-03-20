import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { INFECTIOUS_STATUS_TYPE } from 'src/app/enum/INFECTIOUS_STATUS_TYPE';
import { OutbreakUnitAsso } from 'src/app/model/OutbreakUnitAsso';
import { Stay } from 'src/app/model/Stay';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { ContactExposureService } from 'src/app/service/contact-exposure.service';
import { StayService } from 'src/app/service/stay.service';
import { UINotificationService } from 'src/app/service/uinotification.service';

@Component({
  selector: 'app-outbreak-unit-asso,[app-outbreak-unit-asso]',
  templateUrl: './outbreak-unit-asso.component.html',
  styleUrls: ['./outbreak-unit-asso.component.scss']
})
export class OutbreakUnitAssoComponent implements OnInit {

  @Input()
  outbreakUnitAsso:OutbreakUnitAsso;

  carriersStaysForListing:any[] = [];
  contactsStaysForListing:any[] = [];
  optionsYesNo:SelectItem[] = [];

  numberOfContactExposures:number;
  saving:boolean = false;

  constructor(
    private stayService:StayService,
    private translationService:TranslationService,
    private contactExposureService:ContactExposureService,
    private notificationService:UINotificationService,
  ) { }

  ngOnInit(): void {
    this.getOptionsYesNo();
    this.getCarriersStaysFromOutbreakUnitAsso();
    this.getContactsStaysFromOutbreakUnitAsso();
    this.simulateContactExposures();
  }

  getCarriersStaysFromOutbreakUnitAsso(){
    this.stayService.getCarriersOrContactsStaysForListingFromOutbreakUnitAsso(
      this.outbreakUnitAsso,
      INFECTIOUS_STATUS_TYPE.carrier
    )
    .subscribe(res => {
      if (res != null) {
        this.carriersStaysForListing = res;
      }
    });
  }

  getContactsStaysFromOutbreakUnitAsso(){
    this.stayService.getCarriersOrContactsStaysForListingFromOutbreakUnitAsso(
      this.outbreakUnitAsso,
      INFECTIOUS_STATUS_TYPE.contact
    )
    .subscribe(res => {
      if (res != null) {
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
    this.contactExposureService.simulateContactExposures(this.outbreakUnitAsso)
      .subscribe(res => {
        if (res != null){
          this.numberOfContactExposures = res.length;
        }
      })
  }

  generateContactExposuresAndInfectiousStatuses() {
    this.contactExposureService.generateContactExposuresAndInfectiousStatuses(this.outbreakUnitAsso)
      .subscribe(res => {
        this.saving = true;
        if (res != null){
          this.saving = false;
          this.getContactsStaysFromOutbreakUnitAsso();
          this.notificationService.notifySuccess(
            this.translationService.getTranslation("contact_cases_generated"));
        }
      })
  }

}
