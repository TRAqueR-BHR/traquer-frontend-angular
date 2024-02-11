import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { InfectiousStatusService } from 'src/app/service/infectious-status.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { INFECTIOUS_STATUS_TYPE } from 'src/app/enum/INFECTIOUS_STATUS_TYPE';
import { isConstructorDeclaration } from 'typescript';
import { EnumService } from 'src/app/service/enum.service';
import { SelectItemService } from 'src/app/service/select-item.service';
import { INFECTIOUS_AGENT_CATEGORY } from 'src/app/enum/INFECTIOUS_AGENT_CATEGORY';
import { Utils } from 'src/app/util/utils';
import { EVENT_REQUIRING_ATTENTION_TYPE } from 'src/app/enum/EVENT_REQUIRING_ATTENTION_TYPE';
import { RESPONSE_TYPE } from 'src/app/enum/RESPONSE_TYPE';
import { DialogService } from 'primeng/dynamicdialog';
import { EventRequiringAttention } from 'src/app/model/EventRequiringAttention';
import { EventRequiringAttentionService } from 'src/app/service/event-requiring-attention.service';
import { Patient } from 'src/app/model/Patient';
import { Stay } from 'src/app/model/Stay';
import { formatDate } from '@angular/common';
import { ANALYSIS_REQUEST_TYPE } from 'src/app/enum/ANALYSIS_REQUEST_TYPE';
import { ANALYSIS_RESULT_VALUE_TYPE } from 'src/app/enum/ANALYSIS_RESULT_VALUE_TYPE';
import { SAMPLE_MATERIAL_TYPE } from 'src/app/enum/SAMPLE_MATERIAL_TYPE';
import { AnalysisService } from 'src/app/service/analysis.service';
import { StayService } from 'src/app/service/stay.service';
import { UnitService } from 'src/app/service/unit.service';
import { InfectiousStatusExplanationComponent } from '../../infectious-status/infectious-status-explanation/infectious-status-explanation.component';
import { UINotificationService } from 'src/app/service/uinotification.service';

@Component({
  selector: 'app-stays',
  templateUrl: './stays.component.html',
  styleUrls: ['./stays.component.scss'],
  providers: [DialogService]
})
export class StaysComponent implements OnInit {

  data: any[] = [];

  ligneSelectionnee:any;

  totalRecords: number = 0;

  // This is a workaround for not being able to reference the 'filterValue' entries in queryParams.cols
  filterValues: any = {};

  loading: boolean;

  queryParams:any = {};
  selectedColumns: string[] = [];
  selectableColumns: SelectItem[] = [];

  trueFalseSelectItems:SelectItem[] = [];
  optionsANALYSIS_REQUEST_TYPE:SelectItem[] = [];
  optionsANALYSIS_RESULT_VALUE_TYPE:SelectItem[] = [];
  optionsSAMPLE_MATERIAL_TYPE:SelectItem[] = [];
  optionsUnits:SelectItem[] = [];

  timerOnRefreshDataAfterChangesOnFilter:any;

  splitButtonDefPerEventType:any = {};

  actionMenuItemsFor:any = {}; // a Map of (EVENT_REQUIRING_ATTENTION_TYPE => MenuItem[])

  isDebugMode:boolean = false;

  selectedStay:Stay;

  splitButtonOptions: MenuItem[];

  // This is used to check if the queryParams have changed since the last time we refreshed
  // the data. It is needed because the table widget may detect some changes when actually
  // there is not
  lastQueryParamsAsString:string = null;

  constructor(
    private stayService:StayService,
    private translationService:TranslationService,
    public notificationService:UINotificationService,
    private enumService:EnumService,
    private selectItemService:SelectItemService,
    private eventRequiringAttentionService:EventRequiringAttentionService,
    private authenticationService:AuthenticationService,
    private unitService:UnitService,
    private dialogService: DialogService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {

    this.isDebugMode = this.authenticationService.isDebugMode();

    this.prepareOptionsTrueFalse();
    this.prepareOptionsUnits();
    this.prepareOptionsForSplitButton();
    this.intializeTablesPreferences();
  }

  acknowledgeEvent(rowData:any) {
    console.log(rowData);
  }

  prepareOptionsForSplitButton(){

    this.splitButtonOptions = [
      {
        label: this.translationService.getTranslation("delete_isolation_time"),
        icon: 'pi pi-times',
        command: (event) => {
          console.log(event);
          this.deleteIsolationTime();
        }
      }
    ];
  }

  handleClickOnDefaultAction(rowData){
    console.log(rowData);
    this.selectedStay = new Stay({id:rowData.id});
    this.deleteIsolationTime();
  }

  handleClickOnSplitButtonDropdown(rowData){
    console.log(rowData);
    this.selectedStay = new Stay({id:rowData.id});
  }

  deleteIsolationTime(){
    if (this.selectedStay != null){
      this.stayService.deleteIsolationTime(this.selectedStay).subscribe(res => {
        if (res!=null){
          this.notificationService.notifySuccess(this.translationService.getTranslation("saved"));
        }
      })
    }
  }


  prepareOptionsTrueFalse(){
    this.trueFalseSelectItems.push(
      {
        label: this.translationService.getTranslation("null_option_label"),
        value: null
      }
    );
    this.trueFalseSelectItems.push(
      {
        label: this.translationService.getTranslation("true"),
        value: true
      }
    );
    this.trueFalseSelectItems.push(
      {
        label: this.translationService.getTranslation("false"),
        value: false
      }
    );
  }

  prepareOptionsUnits(){
    this.unitService.getAllUnits(false).subscribe(res =>{

      if (res != null){
        this.optionsUnits = this.selectItemService.createSelectItemsForEntities(
          res,
          "name", // no value property, use the entity itself
          "name"
        );
      }

    });
  }

  intializeTablesPreferences() {

    // Initialize the query params
    this.queryParams = {
      pageSize:environment.numberOfResultsForDashboard,
      pageNum:0,
      cols:[
        ]
    };

    // ############ //
    // Stay columns //
    // ############ //
    const idColDef = {
      field:"id",
      nameInSelect:"id",
      nameInWhereClause:"s.id",
      header: this.translationService.getTranslation("id"),
      attributeType:"string",
      sortable: true,
      filterable: false,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const inTimeColDef = {
      field:"in_time",
      nameInSelect:"in_time",
      nameInWhereClause:"s.in_time",
      header: this.translationService.getTranslation("in_time"),
      attributeType:"date",
      sortable: true,
      filterable: false,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const isolationTimeColDef = {
      field:"isolation_time",
      nameInSelect:"isolation_time",
      nameInWhereClause:"s.isolation_time",
      header: this.translationService.getTranslation("isolation_time"),
      attributeType:"date",
      sortable: true,
      filterable: false,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const outTimeColDef = {
      field:"out_time",
      nameInSelect:"out_time",
      nameInWhereClause:"s.out_time",
      header: this.translationService.getTranslation("out_time"),
      attributeType:"date",
      sortable: true,
      filterable: false,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const hospitalizationInTimeColDef = {
      field:"hospitalization_in_time",
      nameInSelect:"hospitalization_in_time",
      nameInWhereClause:"s.hospitalization_in_time",
      header: this.translationService.getTranslation("hospitalization_in_time"),
      attributeType:"date",
      sortable: true,
      filterable: false,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const hospitalizationOutTimeColDef = {
      field:"hospitalization_out_time",
      nameInSelect:"hospitalization_out_time",
      nameInWhereClause:"s.hospitalization_out_time",
      header: this.translationService.getTranslation("hospitalization_out_time"),
      attributeType:"date",
      sortable: true,
      filterable: false,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const roomColDef = {
      field:"room",
      nameInSelect:"room",
      nameInWhereClause:"s.room",
      header: this.translationService.getTranslation("room"),
      attributeType:"string",
      attributeTest:"like",
      sortable: false,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const sectorColDef = {
      field:"sector",
      nameInSelect:"sector",
      nameInWhereClause:"s.sector",
      header: this.translationService.getTranslation("sector"),
      attributeType:"string",
      attributeTest:"like",
      sortable: false,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };


    // ############ //
    // Unit columns //
    // ############ //
    const unitNameColDef = {
      field:"unit_name",
      nameInSelect:"unit_name",
      nameInWhereClause:"u.name",
      header: this.translationService.getTranslation("unit"),
      attributeType:"string",
      attributeTest:"IN",
      sortable: false,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    // ############### //
    // Patient columns //
    // ############### //
    const patientIdColDef = {
      field:"patient_id",
      nameInSelect:"patient_id",
      nameInWhereClause:"p.id", // The where clause needs special treatment
      header: this.translationService.getTranslation("patient_id"),
      attributeType:"string",
      sortable: false,
      filterable: false,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const birthdateColDef = {
      field:"birthdate",
      nameInSelect:"birthdate",
      nameInWhereClause:"CUSTOM BECAUSE VALUE IS CRYPTED", // The where clause needs special treatment
      header: this.translationService.getTranslation("birthdate"),
      attributeType:"string",
      sortable: false,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const patientRefColDef = {
      field:"patient_ref",
      nameInSelect:"patient_ref",
      nameInWhereClause:"CUSTOM BECAUSE VALUE IS CRYPTED", // The where clause needs special treatment
      header: this.translationService.getTranslation("patient_ref"),
      attributeType:"string",
      sortable: false,
      filterable: true,
      columnIsDisplayed:false,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const lastnameColDef = {
      field:"lastname",
      nameInSelect:"lastname",
      nameInWhereClause:"CUSTOM BECAUSE VALUE IS CRYPTED", // The where clause needs special treatment
      header: this.translationService.getTranslation("lastname"),
      attributeType:"string",
      sortable: false,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const firstnameColDef = {
      field:"firstname",
      nameInSelect:"firstname",
      nameInWhereClause:"CUSTOM BECAUSE VALUE IS CRYPTED", // The where clause needs special treatment
      header: this.translationService.getTranslation("firstname"),
      attributeType:"string",
      sortable: false,
      filterable: false, // Can put too much stress on the database if not combined with other filters
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    // ############# //
    // Action column //
    // ############# //
    const actionColDef = {
      field:"action",
      nameInSelect:null,
      nameInWhereClause:null,
      header: this.translationService.getTranslation("action"),
      attributeType:null,
      sortable: false,
      filterable: false,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };


    // ############### //
    // Add the columns //
    // ############### //
    if (this.isDebugMode) {
      this.queryParams.cols.push(idColDef);
      this.queryParams.cols.push(patientIdColDef);
    }

    if (this.authenticationService.getCryptPwd() != null) {
      this.queryParams.cols.push(firstnameColDef);
      this.queryParams.cols.push(lastnameColDef);
      this.queryParams.cols.push(birthdateColDef);
      this.queryParams.cols.push(patientRefColDef);
    }

    this.queryParams.cols.push(hospitalizationInTimeColDef);
    this.queryParams.cols.push(inTimeColDef);
    this.queryParams.cols.push(isolationTimeColDef);
    this.queryParams.cols.push(outTimeColDef);
    this.queryParams.cols.push(hospitalizationOutTimeColDef);
    this.queryParams.cols.push(unitNameColDef);
    this.queryParams.cols.push(roomColDef);
    this.queryParams.cols.push(sectorColDef);
    this.queryParams.cols.push(actionColDef);

    // this.queryParams.cols.push( {
    //   field: 'view_details',
    //   header: "Voir le détail",
    //   columnIsDisplayed:true,
    //   width:"2em"
    // });

    // Initialize the filter proxy 'filterValues'
    for (let col of this.queryParams.cols) {
      this.filterValues[col.field] = col.filterValue;
    }

    console.log(this.filterValues);

    // Prepare the list of selectable/selected columns
    this.selectableColumns = this.queryParams.cols.map(x => {return {label: x.header,
                                                                     value: x.field}});
    this.selectedColumns = this.queryParams.cols.filter(x => x.columnIsDisplayed).map(x => x.field);

    // Update the filtering as if the user had change something in the filters
    this.updateFiltering(true);

  }

  // We cannot  use the default 'onLazyLoad' function to update the filters
  //   because we initialize the filters input. Because of this the event passed
  //   to the function doesnt contain the filters that are not null but not modified
  updateFiltering(andRefrehData:boolean = true) {

    // Reset to first page
    this.queryParams.pageNum = 0;

    for (let attrName in this.filterValues) {

      // Get the corresponding column in queryParams
      var col = this.queryParams.cols.filter(x => x.field == attrName)[0] ;

      var attrValue = this.filterValues[attrName];

      if (attrValue == null || attrValue.length == 0) {
        col.filterIsActive = false;
        col.filterValue = attrValue;
      } else {
        if (col.attributeType.indexOf("text") > -1) {
          if (attrValue.length < col.minimumCharactersNeeded) {
            col.filterIsActive = false;
          } else {
            col.filterValue = attrValue;
            col.filterIsActive = true;
          }
        } else if (col.attributeType.indexOf("number") > -1) {
            col.filterIsActive = true;
            col.filterValue = parseInt(attrValue);
        } else {
          col.filterValue = attrValue;
          col.filterIsActive = true;
        }
      }
    }

    // We don't want to update the list every time we press a key
    if (andRefrehData) {
      clearTimeout(this.timerOnRefreshDataAfterChangesOnFilter);
      this.timerOnRefreshDataAfterChangesOnFilter = setTimeout(() => {
        this.refreshData()
      }, 1000);
    }

  }


  refreshData() {

    // Check if any change since last refresh
    if (this.lastQueryParamsAsString != null){
      if (this.lastQueryParamsAsString == JSON.stringify(this.queryParams)){
        console.log("No change in queryParams. Skipping refreshData().");
        return;
      }
    }

    // Update the queryParamsString representation
    this.lastQueryParamsAsString = JSON.stringify(this.queryParams);

    // Copy the values originating from the parent component to the query params
    this.loading = true;
    this.stayService.getStaysForListing(this.queryParams).subscribe(res => {
      if (res!= null) {
        console.log(res.rows);
        this.data = res.rows;
        this.totalRecords = res.totalRecords;
      }
      this.loading = false;
    });

  }

    // NOTE: Set 'lazyLoadOnInit' to false if you don't want this function to be called twice the
  //         first time the table is displayed
  updateSorting(event: LazyLoadEvent) {

    this.queryParams.pageNum =  event.first! / event.rows!; // 'event.first' corresponds to an offset
                                                          //    starting at 0 for the fist row of the first page.

    // Clear previous sortings and fill in the query params with the given sortings
    this.clearSortingsInQueryParams();
    if (event.multiSortMeta != null) {
      var sortingRank = 0;
      for (let oneSort of event.multiSortMeta) {
        var attrName = oneSort.field;
        console.log(`sortOn[${attrName}]`)
        if (oneSort.order == 1 || oneSort.order == -1 ) {
          var col = this.queryParams.cols.filter(x => x.field == attrName,
                                                this.queryParams.cols)[0] ;
          col.sorting = oneSort.order;
          col.sortingRank = sortingRank++;
        } else {
          // Left to null
        }
      }
    }

    // console.log(this.queryParams);
    this.refreshData();
  }

  clearSortingsInQueryParams() {
    for (let col of this.queryParams.cols) {
      col.sorting = null;
      col.sortingRank = null;
    }
  }

  updateColumnsSelection(event) {
    for (let attrName of this.selectableColumns.map(x => x.value)) {

      // Get the corresponding column in queryParams
      var col = this.queryParams.cols.filter(x => x.field == attrName,
                                        this.queryParams.cols)[0];
      if (this.selectedColumns.indexOf(attrName) >= 0) {
        col.columnIsDisplayed = true;
      } else {
        // Hide the column
        col.columnIsDisplayed = false;
      }
    }

  }

  showInfectiousStatusExplanation(rowData:any) {

    let formatedDate = formatDate(rowData.birthdate,environment.date_format,this.locale)

    let dialogHeader = `
      ${this.translationService.getTranslation("history")}
      ${rowData.firstname} ${rowData.lastname} ${formatedDate}
    `;

    const ref = this.dialogService.open(InfectiousStatusExplanationComponent, {
        data: {
          "patient": new Patient({id:rowData["patient_id"]})
        },
        header: dialogHeader,
        width: '85%'
    });
  }

}
