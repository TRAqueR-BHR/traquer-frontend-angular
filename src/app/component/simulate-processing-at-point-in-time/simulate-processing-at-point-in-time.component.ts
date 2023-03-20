import { Component, OnInit } from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { SimulateProcessingAtPointInTimeService } from 'src/app/service/simulate-processing-at-point-in-time.service';
import { UINotificationService } from 'src/app/service/uinotification.service';


@Component({
  selector: 'app-simulate-processing-at-point-in-time',
  templateUrl: './simulate-processing-at-point-in-time.component.html',
  styleUrls: ['./simulate-processing-at-point-in-time.component.scss']
})
export class SimulateProcessingAtPointInTimeComponent implements OnInit {

  forceProcessingTime:Date;
  processingInProgress:boolean = false;
  resetInProgress:boolean = false;

  constructor(
    private translationService:TranslationService,
    private confirmationService: ConfirmationService,
    private notificationsService: UINotificationService,
    private simulateProcessingAtPointInTimeService:SimulateProcessingAtPointInTimeService
  ) { }

  ngOnInit(): void {
  }

  process(){
    this.processingInProgress = true;
    this.simulateProcessingAtPointInTimeService.processNewDataAtGivenTime(this.forceProcessingTime).subscribe(res => {
      this.processingInProgress = false;
      if (res != null){
        console.log("successful process");
        this.notificationsService.notifySuccess(
          this.translationService.getTranslation("successful_processing")
        );
      }
    });
  }

  reset(){
    this.resetInProgress = true;
    this.simulateProcessingAtPointInTimeService.resetData().subscribe(res => {
      this.resetInProgress = false;
      if (res != null){
        console.log("successful reset");
        this.notificationsService.notifySuccess(
          this.translationService.getTranslation("successful_reset")
        );
      }
    });
  }

  confirmReset(event) {

    let confirmationMsg = this.translationService.getTranslation(
      "are_you_sure_that_you_want_to_delete_all_infectious_status_and_associated_elements");
    let acceptLabel = (`${this.translationService.getTranslation("yes")}`);


    this.confirmationService.confirm({
      target: event.target,
      message: confirmationMsg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.reset();
      },
      reject: () => {
          //reject action
      },
      acceptLabel: acceptLabel,
      rejectLabel: this.translationService.getTranslation("no"),
    });

  }

}
