import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { OutbreakConfigUnitAsso } from 'src/app/model/OutbreakConfigUnitAsso';
import { Stay } from 'src/app/model/Stay';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { ContactExposureService } from 'src/app/service/contact-exposure.service';
import { StayService } from 'src/app/service/stay.service';
import { UINotificationService } from 'src/app/service/uinotification.service';

@Component({
  selector: 'app-outbreak-config-unit-asso,[app-outbreak-config-unit-asso]',
  templateUrl: './outbreak-config-unit-asso.component.html',
  styleUrls: ['./outbreak-config-unit-asso.component.scss']
})
export class OutbreakConfigUnitAssoComponent implements OnInit {

  @Input()
  outbreakConfigUnitAsso:OutbreakConfigUnitAsso;

  carrierStaysForListing:any[] = [];
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
    this.getCarrierStaysFromOutbreakConfigUnitAsso();
    this.simulateContactExposures();
  }

  getCarrierStaysFromOutbreakConfigUnitAsso(){
    this.stayService.getCarriersStaysForListingFromOutbreakConfigUnitAsso(this.outbreakConfigUnitAsso)
    .subscribe(res => {
      if (res != null) {
        this.carrierStaysForListing = res;
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
    this.contactExposureService.simulateContactExposures(this.outbreakConfigUnitAsso)
      .subscribe(res => {
        if (res != null){
          this.numberOfContactExposures = res.length;
        }
      })
  }

  generateContactExposuresAndInfectiousStatuses() {
    this.contactExposureService.generateContactExposuresAndInfectiousStatuses(this.outbreakConfigUnitAsso)
      .subscribe(res => {
        this.saving = true;
        if (res != null){
          this.saving = false;
          this.notificationService.notifySuccess(
            this.translationService.getTranslation("contact_cases_generated"));
        }
      })
  }

}
