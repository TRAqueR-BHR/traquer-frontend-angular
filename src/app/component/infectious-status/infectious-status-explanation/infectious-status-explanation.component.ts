import { DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrimeIcons } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ANALYSIS_REQUEST_TYPE } from 'src/app/enum/ANALYSIS_REQUEST_TYPE';
import { ANALYSIS_RESULT_VALUE_TYPE } from 'src/app/enum/ANALYSIS_RESULT_VALUE_TYPE';
import { INFECTIOUS_AGENT_CATEGORY } from 'src/app/enum/INFECTIOUS_AGENT_CATEGORY';
import { INFECTIOUS_STATUS_TYPE } from 'src/app/enum/INFECTIOUS_STATUS_TYPE';
import { AnalysisResult } from 'src/app/model/AnalysisResult';
import { ContactExposure } from 'src/app/model/ContactExposure';
import { InfectiousStatus } from 'src/app/model/InfectiousStatus';
import { Patient } from 'src/app/model/Patient';
import { Stay } from 'src/app/model/Stay';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { AnalysisService } from 'src/app/service/analysis.service';
import { ContactExposureService } from 'src/app/service/contact-exposure.service';
import { EnumService } from 'src/app/service/enum.service';
import { InfectiousStatusService } from 'src/app/service/infectious-status.service';
import { OutbreakService } from 'src/app/service/outbreak.service';
import { SelectItemService } from 'src/app/service/select-item.service';
import { StayService } from 'src/app/service/stay.service';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-infectious-status-explanation',
  templateUrl: './infectious-status-explanation.component.html',
  styleUrls: ['./infectious-status-explanation.component.scss']
})
export class InfectiousStatusExplanationComponent implements OnInit {

  timelineNodes: any[];

  timeline:{
    date:Date,
    mainTitle:string,
    color:string,
    events:{
      type:string,
      title:string,
      details:string
      link:string|null
    }[]
  }[] = [];

  preparingTimeline:boolean = false;

  // timeline:any[] = [3];

  // @Input()
  // infectiousStatus:InfectiousStatus;

  @Input()
  patient:Patient;

  stays:Stay[] = [];
  infectiousStatuses:InfectiousStatus[] = [];
  analysesResults:AnalysisResult[] = [];
  contactExposuresDF:any[] = [];

  // Display booleans
  debug:boolean = false;

  // Resources loaded checker
  resourcesLoadedChecker = {
    resourcesAreLoaded: false,
    resourcesLoaded:{
      infectiousStatuses:false,
      contactExposures:false,
      stays:false,
      analysesResults:false
    }
  }

  constructor(
    private translationService:TranslationService,
    private route: ActivatedRoute,
    private outbreakService:OutbreakService,
    private infectiousStatusService:InfectiousStatusService,
    private stayService:StayService,
    private analysisService:AnalysisService,
    private contactExposureService:ContactExposureService,
    private enumService:EnumService,
    private selectItemService:SelectItemService,
    public dialogRef: DynamicDialogRef,
    // private datePipe: DatePipe,
    public dialogConfig: DynamicDialogConfig,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {
    this.preparingTimeline = true;
    this.setDebuggingComponentFlag();
    this.getPatient();

    this.timelineNodes = [
      {title: 'Processing', date: new Date('2020-10-15T12:30'), icon: PrimeIcons.COG, color: '#673AB7'},
      {title: 'Ordered', date: new Date('2020-10-15T10:30'), icon: PrimeIcons.SHOPPING_CART, color: '#9C27B0', image: 'game-controller.jpg'},
      // {title: 'Shipped', date: '15/10/2020 16:15', icon: PrimeIcons.ENVELOPE, color: '#FF9800'},
      // {title: 'Delivered', date: '16/10/2020 10:00', icon: PrimeIcons.CHECK, color: '#607D8B'}
    ].sort((a,b) => {
      if (a.date > b.date){
        return 1;
      }else if(a.date < b.date){
        return -1
      }
      else{
        return 0
      }
    });
  }

  setDebuggingComponentFlag() {
    if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[0].path == "debug5") {
      this.debug = true;
    }
  }

  getPatient(){

    if (this.patient != null) {
      // do nothing
    }
    // Get the event from the dialog input config if any
    else if (this.dialogConfig != null && this.dialogConfig.data != null) {
      this.patient = this.dialogConfig.data.patient;
    } else if (this.debug === true){
      this.patient = new Patient({id:this.route.snapshot.paramMap.get('patientId')});
    }
    this.getPatientHistory();
  }

  getPatientHistory(){
    this.getPatientInfectiousStatuses();
    this.getPatientStays();
    this.getPatientAnalyses();
    this.getPatientExposuresForListing();
  }

  getPatientExposuresForListing(){
    this.contactExposureService.getPatientExposuresForListing(this.patient).subscribe(
      res => {
        if (res != null){
          console.log(res);
          this.contactExposuresDF = res;

          // Update the resources loaded checker
          this.resourcesLoadedChecker.resourcesLoaded.contactExposures = true;
          this.updateResourcesLoaded();
        }
      }
    )
  }

  getPatientInfectiousStatuses(){

    let infectiousStatus = new InfectiousStatus({});
    infectiousStatus.patient = this.patient;
    console.log(infectiousStatus);
    this.infectiousStatusService.geInfectiousStatusFromInfectiousStatusFilter(
      infectiousStatus, true
    )
    .subscribe(res => {
      if (res != null){
        this.infectiousStatuses = res;

        // Update the resources loaded checker
        this.resourcesLoadedChecker.resourcesLoaded.infectiousStatuses = true;
        this.updateResourcesLoaded();
      }
    });

  }

  getPatientStays(){

    let stayFilter = new Stay({});
    stayFilter.patient = this.patient;
    this.stayService.geStayFromStayFilter(
      stayFilter, true
    )
    .subscribe(res => {
      if (res != null){
        this.stays = res;

        // Update the resources loaded checker
        this.resourcesLoadedChecker.resourcesLoaded.stays = true;
        this.updateResourcesLoaded();
      }
    });
  }

  getPatientAnalyses(){
    this.analysisService.getAnalysesFromPatient(this.patient).subscribe(res => {
      if (res != null){
        this.analysesResults = res;

        // Update the resources loaded checker
        this.resourcesLoadedChecker.resourcesLoaded.analysesResults = true;
        this.updateResourcesLoaded();
      }
    });
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
    this.merge();
  }

  updateDisplayBooleans() {

  }

  getRoomDescription(stay:Stay):string {
    let roomStr = stay.room != null ?
      this.translationService.getTranslation("room") + " " + stay.room : "";
    return roomStr;
  }

  getHospitalizationDescription(stay:Stay):string {
    let hospitalizationInTimeStr = formatDate(
      new Date(stay.hospitalizationInTime),environment.datetime_format,this.locale
    );
    let hospitalizationOutTimeStr = stay.hospitalizationOutTime != null ?
      formatDate(new Date(stay.hospitalizationOutTime),environment.datetime_format,this.locale) : "";
    let result = `
        ${this.translationService.getTranslation("hospitalization")} :
        ${hospitalizationInTimeStr} ⟶ ${hospitalizationOutTimeStr}
    `;

    return result;
  }

  merge() {

    let eltsFromExposures = this.contactExposureArr2TimelineEltArr(this.contactExposuresDF);
    let eltsFromAnalysis = this.analysisResultArr2TimelineEltArr(this.analysesResults);
    let eltsFromInfectiousStatusRefTime =
      this.infectiousStatusArr2TimelineRefTimeEltArr(this.infectiousStatuses);
    let eltsFromInfectiousStatusUpdatedRefTime =
      this.infectiousStatusArr2TimelineUpdatedRefTimeEltArr(this.infectiousStatuses);
    let eltsFromStaysIn = this.stayInArr2TimelineEltArr(this.stays);
    let eltsFromStaysIsolationTime = this.stayIsolationTimeArr2TimelineEltArr(this.stays);
    let eltsFromStaysOut = this.stayOutArr2TimelineEltArr(this.stays);

    let allElts:{title: string, date: Date, type: string, details:string, link:string}[] = [];
    allElts.push(...eltsFromStaysIn);
    allElts.push(...eltsFromStaysIsolationTime);
    allElts.push(...eltsFromInfectiousStatusUpdatedRefTime);
    allElts.push(...eltsFromStaysOut);
    allElts.push(...eltsFromExposures);
    allElts.push(...eltsFromAnalysis);
    allElts.push(...eltsFromInfectiousStatusRefTime);

    this.timeline = []; // Needed to mage angular detect that the array has changed

    for (let elt of allElts) {

      // Add the event to an existing date entry or to a new date entry
      let idxOfExistingEvtAtDate = this.timeline.findIndex(
        x => x.date.getTime() == elt["date"].getTime())
      if (idxOfExistingEvtAtDate == - 1){
        this.timeline.push({
          date: elt["date"],
          mainTitle: elt["title"],
          color: '#673AB7',
          events: [elt]
        })
      } else {
        this.timeline[idxOfExistingEvtAtDate].events.push(elt);
      }

    }

    // Sort
    this.timeline.sort((a,b) => {
      if (a.date > b.date){
        return 1;
      }else if(a.date < b.date){
        return -1
      }
      else{
        return 0
      }
    });
    this.timeline.reverse();

    this.preparingTimeline = false;

  }

  contactExposureArr2TimelineEltArr(array:Array<any>):
    {title: string, date: Date, type: string, details:string, link:string}[]
  {

    let result = array.map(x => {

      // let exposureStartStr = this.datePipe.transform(
      //   new Date(x.start_time), environment.datetime_format);

      let exposureStartStr = formatDate(new Date(x.start_time),environment.datetime_format,this.locale);
      let exposureEndStr = formatDate(new Date(x.end_time),environment.datetime_format,this.locale);

      let title = `
          ${this.translationService.getTranslation("exposure")}
          ${this.translationService.getTranslation(x.outbreak_infectious_agent + "_shortname")} :
          ${x.carrier_firstname} ${x.carrier_lastname},
          ${x.unit_name} ${exposureStartStr} ⟶  ${exposureEndStr},
          ${this.translationService.getTranslation("outbreak")} ${x.outbreak_name}
        `;
      let details = "TODO details of exposure";

      let node = {
        title:title,
        date:new Date(x.start_time),
        type:"exposure",
        details:details,
        link:null,
      };

      return node;
    })
    return result;
  }

  analysisResultArr2TimelineEltArr(array:Array<AnalysisResult>):
    {title: string, date: Date, type: string, details:string, link:string}[]
  {

    let result = array.map(x => {

      let title = (
        this.translationService.getTranslation(ANALYSIS_REQUEST_TYPE[x.requestType]) + " : "
        + this.translationService.getTranslation(
          `ANALYSIS_RESULT_VALUE_TYPE_${ANALYSIS_RESULT_VALUE_TYPE[x.result]}`
        )
      );
      let details = "TODO details of analysis";

      let node = {
        title:title,
        date:new Date(x.requestTime),
        type:"analysis",
        details:details,
        link:null,
      };

      return node;
    })
    return result;
  }

  infectiousStatusArr2TimelineRefTimeEltArr(array:Array<InfectiousStatus>):
    {title: string, date: Date, type: string, details:string, link:string}[]
  {

    let result = array.map(x => {

      let title = (
        this.translationService.getTranslation("infectious_status") + " "
        + this.translationService.getTranslation(`${INFECTIOUS_AGENT_CATEGORY[x.infectiousAgent]}_shortname`) + " : "
        + this.translationService.getTranslation(
          `INFECTIOUS_STATUS_TYPE_${INFECTIOUS_STATUS_TYPE[x.infectiousStatus]}`
        )
      );
      let details = "TODO details of infectious status";

      let node = {
        title:title,
        date:new Date(x.refTime),
        type:"infectious_status",
        details:details,
        link:null,
      };

      return node;
    })
    return result;
  }

  infectiousStatusArr2TimelineUpdatedRefTimeEltArr(array:Array<InfectiousStatus>):
    {title: string, date: Date, type: string, details:string, link:string}[]
  {

    let result = array.filter(x => x.updatedRefTime != null).map(x => {
      let title = (
        this.translationService.getTranslation("infectious_status") + " "
        + this.translationService.getTranslation(`${INFECTIOUS_AGENT_CATEGORY[x.infectiousAgent]}_shortname`) + " : "
        + this.translationService.getTranslation(
          `INFECTIOUS_STATUS_TYPE_${INFECTIOUS_STATUS_TYPE[x.infectiousStatus]}`
        )
        + ` (${this.translationService.getTranslation("reactivated")})`
      );
      let details = "TODO details of infectious status";

      let node = {
        title:title,
        date:new Date(x.updatedRefTime),
        type:"infectious_status",
        details:details,
        link:null,
      };

      return node;
    })
    return result;
  }

  stayInArr2TimelineEltArr(array:Array<Stay>):
  {title: string, date: Date, type: string, details:string, link:string}[]
  {

    let result = array.map(x => {

      let roomStr = x.room != null ? this.translationService.getTranslation("room") + " " + x.room : "";

      let title = `
        ${this.translationService.getTranslation("stay_begin")}
        ${x.unit.name}
        ${this.getRoomDescription(x)}
        (${this.getHospitalizationDescription(x)})
      `;
      let details = "TODO details of analysis";


      let node = {
        title:title,
        date:new Date(x.inTime),
        type:"stay",
        details:details,
        link:null,
      };

      return node;
    })
    return result;
  }

  stayOutArr2TimelineEltArr(array:Array<Stay>):
  {title: string, date: Date, type: string, details:string, link:string}[]
  {

    // Only keep the stays with an out time
    array = array.filter(x => x.outTime != null);

    let result = array.map(x => {

      let roomStr = x.room != null ? this.translationService.getTranslation("room") + " " + x.room : "";

      let title = `
        ${this.translationService.getTranslation("stay_end")}
        ${x.unit.name}
        ${this.getRoomDescription(x)}
        (${this.getHospitalizationDescription(x)})
      `;

      let details = "TODO details of analysis";


      let node = {
        title:title,
        date:new Date(x.outTime),
        type:"stay",
        details:details,
        link:null,
      };

      return node;
    })
    return result;
  }

  stayIsolationTimeArr2TimelineEltArr(array:Array<Stay>):
  {title: string, date: Date, type: string, details:string, link:string}[]
  {

    // Only keep the stays with an out time
    array = array.filter(x => x.isolationTime != null);

    let result = array.map(x => {

      let isolationTimeStr = formatDate(new Date(x.isolationTime),environment.datetime_format,this.locale);
      let title = `
        ${this.translationService.getTranslation("isolation")}
      `;
      let details = "";


      let node = {
        title:title,
        date:new Date(x.isolationTime),
        type:"stay",
        details:details,
        link:null,
      };

      return node;
    })
    return result;
  }


}
