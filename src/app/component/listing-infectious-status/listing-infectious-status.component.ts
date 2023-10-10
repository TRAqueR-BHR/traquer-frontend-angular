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
import { InfectiousStatusExplanationComponent } from '../infectious-status/infectious-status-explanation/infectious-status-explanation.component';
import { EventRequiringAttention } from 'src/app/model/EventRequiringAttention';
import { ResponsesToEventComponent } from '../responses-to-event/responses-to-event.component';
import { EventRequiringAttentionService } from 'src/app/service/event-requiring-attention.service';
import { Patient } from 'src/app/model/Patient';
import { formatDate } from '@angular/common';
import { InfectiousStatusEditComponent } from '../infectious-status/infectious-status-edit/infectious-status-edit.component';
import { PatientEditorComponent } from '../patient/patient-editor/patient-editor.component';
import { StayEditComponent } from '../stay/stay-edit/stay-edit.component';
import { AnalysisResultEditComponent } from '../analysis/analysis-result-edit/analysis-result-edit.component';

@Component({
  selector: 'app-listing-infectious-status',
  templateUrl: './listing-infectious-status.component.html',
  styleUrls: ['./listing-infectious-status.component.scss'],
  providers: [DialogService]
})
export class ListingInfectiousStatusComponent implements OnInit {

  data: any[] = [];

  ligneSelectionnee:any;

  totalRecords: number = 0;

  // This is a workaround for not being able to reference the 'filterValue' entries in queryParams.cols
  filterValues: any = {};

  loading: boolean;
  primengCalendarTranslation:any;

  queryParams:any = {};
  selectedColumns: string[] = [];
  selectableColumns: SelectItem[] = [];

  trueFalseSelectItems:SelectItem[] = [];
  optionsINFECTIOUS_STATUS_TYPE:SelectItem[] = [];
  optionsINFECTIOUS_AGENT_CATEGORY:SelectItem[] = [];
  optionsEVENT_REQUIRING_ATTENTION_TYPE:SelectItem[] = [];

  timerOnRefreshDataAfterChangesOnFilter:any;

  splitButtonDefPerEventType:any = {};

  actionMenuItemsFor:any = {}; // a Map of (EVENT_REQUIRING_ATTENTION_TYPE => MenuItem[])

  fr: any;

  constructor(
    private infectiousStatusService:InfectiousStatusService,
    private translationService:TranslationService,
    private enumService:EnumService,
    private selectItemService:SelectItemService,
    private eventRequiringAttentionService:EventRequiringAttentionService,
    private authenticationService:AuthenticationService,
    public dialogService: DialogService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {
    this.prepareOptionsTrueFalse();
    this.prepareOptionsINFECTIOUS_STATUS_TYPE();
    this.prepareOptionsINFECTIOUS_AGENT_CATEGORY();
    this.prepareOptionsEVENT_REQUIRING_ATTENTION_TYPE();
    this.intializeTablesPreferences();
  }

  acknowledgeEvent(rowData:any) {
    console.log(rowData);
  }

  getDefaultAndSecondaryaPossibleResponses(
    eventType:EVENT_REQUIRING_ATTENTION_TYPE,
    statusType:INFECTIOUS_STATUS_TYPE
  ){

    console.log(eventType);
    console.log(statusType);

    let defaultResponseType:RESPONSE_TYPE;
    let secondaryResponseTypes:RESPONSE_TYPE[] = [];

    if (eventType == EVENT_REQUIRING_ATTENTION_TYPE.analysis_done) {
      defaultResponseType = RESPONSE_TYPE.acknowledge;
      secondaryResponseTypes = [
        RESPONSE_TYPE.request_analysis // Maybe we want to make another analysis
      ]
    } else if (eventType == EVENT_REQUIRING_ATTENTION_TYPE.analysis_in_progress) {
      defaultResponseType = RESPONSE_TYPE.acknowledge;
      secondaryResponseTypes = [
        RESPONSE_TYPE.request_analysis // Maybe we want to make another analysis
      ]
    } else if (eventType == EVENT_REQUIRING_ATTENTION_TYPE.analysis_late) {
      defaultResponseType = RESPONSE_TYPE.send_a_reminder;
      secondaryResponseTypes = [
        RESPONSE_TYPE.request_analysis // Maybe we want to make another analysis
      ]
    } else if (eventType == EVENT_REQUIRING_ATTENTION_TYPE.new_stay) {

      if (statusType == INFECTIOUS_STATUS_TYPE.carrier) {
        defaultResponseType = RESPONSE_TYPE.isolation_in_same_unit;
        secondaryResponseTypes = [
          RESPONSE_TYPE.isolation_in_special_unit,
          RESPONSE_TYPE.request_analysis, // Maybe we want to make another analysis
          RESPONSE_TYPE.acknowledge,
        ]
      } else if (statusType == INFECTIOUS_STATUS_TYPE.contact) {
        defaultResponseType = RESPONSE_TYPE.request_analysis;
        secondaryResponseTypes = [
          RESPONSE_TYPE.acknowledge,
          RESPONSE_TYPE.isolation_in_same_unit,
          RESPONSE_TYPE.isolation_in_special_unit,
        ]
      } else if (statusType == INFECTIOUS_STATUS_TYPE.not_at_risk) {
        defaultResponseType = RESPONSE_TYPE.acknowledge;
        secondaryResponseTypes = [
          RESPONSE_TYPE.acknowledge,
          RESPONSE_TYPE.request_analysis,
        ]
      }

    } else if (eventType == EVENT_REQUIRING_ATTENTION_TYPE.new_status) {

      if (statusType == INFECTIOUS_STATUS_TYPE.carrier) {
        defaultResponseType = RESPONSE_TYPE.confirm;
        secondaryResponseTypes = [
          RESPONSE_TYPE.declare_outbreak,
          RESPONSE_TYPE.request_analysis,
          RESPONSE_TYPE.isolation_in_same_unit,
          RESPONSE_TYPE.isolation_in_special_unit,
        ]
      } else if (statusType == INFECTIOUS_STATUS_TYPE.contact) {
        defaultResponseType = RESPONSE_TYPE.confirm;
        secondaryResponseTypes = [
          RESPONSE_TYPE.request_analysis,
          RESPONSE_TYPE.isolation_in_same_unit,
          RESPONSE_TYPE.isolation_in_special_unit,
        ]
      } else if (statusType == INFECTIOUS_STATUS_TYPE.not_at_risk) {
        defaultResponseType = RESPONSE_TYPE.confirm;
        secondaryResponseTypes = [
          RESPONSE_TYPE.request_analysis,
        ]
      }

    }

    if (defaultResponseType == null) {
      throw new Error(
        `Unsupported INFECTIOUS_STATUS_TYPE[${INFECTIOUS_STATUS_TYPE[statusType]}] for
        EVENT_REQUIRING_ATTENTION_TYPE[${EVENT_REQUIRING_ATTENTION_TYPE[eventType]}]`
      )
    }

    return {
      defaultResponseType:defaultResponseType,
      secondaryResponseTypes:secondaryResponseTypes
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

  prepareOptionsINFECTIOUS_STATUS_TYPE() {
    this.enumService.listAllPossibleValues(INFECTIOUS_STATUS_TYPE).subscribe(
      res => {
          this.optionsINFECTIOUS_STATUS_TYPE =
            this.selectItemService.createSelectItemsForEnums(
              res,
              INFECTIOUS_STATUS_TYPE,
              true // null options
              );
      }
    );
  }

  prepareOptionsINFECTIOUS_AGENT_CATEGORY() {
    this.enumService.listAllPossibleValues(INFECTIOUS_AGENT_CATEGORY).subscribe(
      res => {
          this.optionsINFECTIOUS_AGENT_CATEGORY =
            this.selectItemService.createSelectItemsForEnums(
              res,
              INFECTIOUS_AGENT_CATEGORY,
              true, // null options
              "",
              "_shortname"
              );
      }
    );
  }

  prepareOptionsEVENT_REQUIRING_ATTENTION_TYPE() {
    this.enumService.listAllPossibleValues(EVENT_REQUIRING_ATTENTION_TYPE).subscribe(
      res => {
          this.optionsEVENT_REQUIRING_ATTENTION_TYPE =
            this.selectItemService.createSelectItemsForEnums(
              res,
              EVENT_REQUIRING_ATTENTION_TYPE,
              true, // null options
              "EVENT_REQUIRING_ATTENTION_TYPE_"
              );
      }
    );
  }

  intializeTablesPreferences() {

    // Initialize the query params
    this.queryParams = {
      pageSize:environment.numberOfResultsForDashboard,
      pageNum:0,
      cols:[
        ]
    };

    // ######################## //
    // Infectious status column //
    // ######################## //
    const idColDef = {
      field:"infectious_status_id",
      nameInSelect:"infectious_status_id",
      nameInWhereClause:"ist.id",
      header: this.translationService.getTranslation("infectious_status_id"),
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

    const refTimeColDef = {
      field:"ref_time",
      nameInSelect:"ref_time",
      nameInWhereClause:"ist.ref_time",
      header: this.translationService.getTranslation("infectious_status_reference_time_abbreviated"),
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
    // {
    //   field:"traquer_ref",
    //   nameInSelect:"traquer_ref",
    //   nameInWhereClause:"p.traquer_ref",
    //   header: "Ref. Traquer",
    //   attributeType:"number",
    //   sortable: true,
    //   filterable: true,
    //   columnIsDisplayed:true,
    //   filterIsActive:false,
    //   minimumCharactersNeeded:3,
    //   filterValue:null,
    //   sorting:null, // null, 1, -1
    //   sortingRank:null,
    //   width:"2em"
    // },

    const infectiousStatusColDef = {
      field:"infectious_status",
      nameInSelect:"infectious_status",
      nameInWhereClause:"ist.infectious_status",
      header: this.translationService.getTranslation("infectious_status"),
      attributeType:"enum",
      enumType: Utils.getEnumName(INFECTIOUS_STATUS_TYPE),
      attributeTest:"IN",
      sortable: true,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"2em"
    };

    const infectiousAgentColDef = {
      field:"infectious_agent",
      nameInSelect:"infectious_agent",
      nameInWhereClause:"ist.infectious_agent",
      header: this.translationService.getTranslation("infectious_agent"),
      enumType: Utils.getEnumName(INFECTIOUS_AGENT_CATEGORY),
      attributeType:"enum",
      attributeTest:"IN",
      sortable: true,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"2em"
    };

    const isConfirmedColDef = {
      field:"is_confirmed",
      nameInSelect:"is_confirmed",
      nameInWhereClause:"ist.is_confirmed",
      header: this.translationService.getTranslation("confirmed?"),
      attributeType:"boolean",
      attributeTest:"EQUALS",
      sortable: true,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"2em"
    };

    const isCurrentColDef = {
      field:"is_current",
      nameInSelect:"is_current",
      nameInWhereClause:"ist.is_current",
      header: this.translationService.getTranslation("is_current_status?"),
      attributeType:"boolean",
      attributeTest:"EQUALS",
      sortable: true,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:true,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"2em"
    };

    // ################################# //
    // Event requiring attention columns //
    // ################################# //
    const eventIdColDef = {
      field:"event_id",
      nameInSelect:"event_id",
      nameInWhereClause:"era.id",
      header: this.translationService.getTranslation("event_id"),
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

    const eventRefTimeColDef = {
      field:"event_ref_time",
      nameInSelect:"event_ref_time",
      nameInWhereClause:"era.ref_time",
      header: this.translationService.getTranslation("event_reference_time_abbreviated"),
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

    const eventResponseTimeColDef = {
      field:"event_response_time",
      nameInSelect:"event_response_time",
      nameInWhereClause:"era.response_time",
      header: this.translationService.getTranslation("event_response_time"),
      attributeType:"date",
      attributeTest:"EQUALS",
      sortable: true,
      filterable: false,
      columnIsDisplayed:false,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"2em"
    };

    const eventIsPendingColDef = {
      field:"event_is_pending",
      nameInSelect:"event_is_pending",
      nameInWhereClause:"era.is_pending",
      header: this.translationService.getTranslation("event_is_pending"),
      attributeType:"boolean",
      attributeTest:"EQUALS",
      sortable: true,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:true,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"2em"
    };

    const eventTypeColDef = {
      field:"event_type",
      nameInSelect:"event_type",
      nameInWhereClause:"era.event_type",
      header: this.translationService.getTranslation("event_type"),
      attributeType:"enum",
      enumType: Utils.getEnumName(EVENT_REQUIRING_ATTENTION_TYPE),
      attributeTest:"IN",
      sortable: true,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"2em"
    };


    // ############### //
    // Patient columns //
    // ############### //
    const patientIdColDef = {
      field:"patient_id",
      nameInSelect:"patient_id",
      nameInWhereClause:"p.id",
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

    const patientIsHospitalizedColDef = {
      field:"patient_is_hospitalized",
      nameInSelect:"patient_is_hospitalized",
      nameInWhereClause:"p.is_hospitalized",
      header: this.translationService.getTranslation("hospitalized?"),
      attributeType:"boolean",
      attributeTest:"EQUALS",
      sortable: true,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"2em"
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
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    const patientCurrentUnitNameColDef = {
      field:"current_unit_name",
      nameInSelect:"current_unit_name",
      nameInWhereClause:"patient_current_unit.name",
      header: this.translationService.getTranslation("current_unit_name"),
      attributeType:"string",
      attributeTest:"like",
      sortable: true,
      filterable: true,
      columnIsDisplayed:true,
      filterIsActive:false,
      minimumCharactersNeeded:3,
      filterValue:null,
      sorting:null, // null, 1, -1
      sortingRank:null,
      width:"4em"
    };

    // ################ //
    // Outbreak columns //
    // ################ //
    const outbreakIdColDef = {
      field:"outbreak_id",
      nameInSelect:"outbreak_id",
      nameInWhereClause:"o.id",
      header: this.translationService.getTranslation("outbreak_id"),
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

    const outbreakNameColDef = {
      field:"outbreak_name",
      nameInSelect:"outbreak_name",
      nameInWhereClause:"o.name",
      header: this.translationService.getTranslation("outbreak"),
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
    if (this.authenticationService.isDebugMode()) {
      this.queryParams.cols.push(eventIdColDef);
      this.queryParams.cols.push(patientIdColDef);
    }

    if (this.authenticationService.getCryptPwd() != null) {
      this.queryParams.cols.push(firstnameColDef);
      this.queryParams.cols.push(lastnameColDef);
      this.queryParams.cols.push(birthdateColDef);
      this.queryParams.cols.push(patientRefColDef);
    }

    if (this.authenticationService.isDebugMode()) {
      this.queryParams.cols.push(outbreakIdColDef);
    }
    this.queryParams.cols.push(outbreakNameColDef);
    if (this.authenticationService.isDebugMode()) {
      this.queryParams.cols.push(idColDef);
    }
    this.queryParams.cols.push(infectiousStatusColDef);
    this.queryParams.cols.push(infectiousAgentColDef);
    this.queryParams.cols.push(refTimeColDef);
    this.queryParams.cols.push(isConfirmedColDef);
    this.queryParams.cols.push(isCurrentColDef);
    this.queryParams.cols.push(patientIsHospitalizedColDef);
    this.queryParams.cols.push(patientCurrentUnitNameColDef);
    this.queryParams.cols.push(eventRefTimeColDef);
    this.queryParams.cols.push(eventResponseTimeColDef);
    this.queryParams.cols.push(eventTypeColDef);
    this.queryParams.cols.push(eventIsPendingColDef);
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


          // The columns with numeric type but a boolean filter are interpreted as filters on the anomaly type.
          //  'false' is interpreted as null


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

    // Copy the values originating from the parent component to the query params
    console.log(this.queryParams["field"]);

    this.loading = true;
    this.infectiousStatusService.getInfectiousStatusForListing(this.queryParams).subscribe(res => {
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

    if (rowData.patient_is_hospitalized === true) {
      dialogHeader += " " + this.translationService.getTranslation("hospitalization_in_progress");
    }

    if (rowData.current_unit_name != null) {
      dialogHeader += " " + rowData.current_unit_name;
    }

    const ref = this.dialogService.open(InfectiousStatusExplanationComponent, {
        data: {
          "patient": new Patient({id:rowData["patient_id"]})
        },
        header: dialogHeader,
        width: '85%'
    });
  }

  handleClickOnNewPatientBtn(evt:any){
    const ref = this.dialogService.open(PatientEditorComponent, {
      data: {
        asDialog: true
      },
      header: this.translationService.getTranslation("new_patient"),
      width: '85%'
    });

    ref.onClose.subscribe((_newPatient:Patient) => {
      // var colPatientId = this.queryParams.cols.filter(x => x.field == "patient_id")[0] ;
      // colPatientId.filterValue = _newPatient.id;
      // colPatientId.filterable = true;
      // colPatientId.filterIsActive = true;
      this.refreshData();
    });
  }


  handleClickOnNewInfectiousStatusBtn(evt:any){
    const ref = this.dialogService.open(InfectiousStatusEditComponent, {
      data: {
        "new": true
      },
      header: this.translationService.getTranslation("add_infectious_status"),
      width: '85%'
    });

    ref.onClose.subscribe(res=> {
      this.refreshData();
    })
  }

  handleClickOnNewStayBtn(evt:any){
    const ref = this.dialogService.open(StayEditComponent, {
      data: {
        "new": true
      },
      header: this.translationService.getTranslation("add_stay"),
      width: '85%'
    });

    ref.onClose.subscribe(res=> {
      this.refreshData();
    })
  }

  handleClickOnNewAnalysisResultBtn(evt:any){
    const ref = this.dialogService.open(AnalysisResultEditComponent, {
      data: {
        "new": true
      },
      header: this.translationService.getTranslation("add_analysis"),
      width: '85%'
    });

    ref.onClose.subscribe(res=> {
      this.refreshData();
    })
  }

  displayDialogForUserResponse(rowData:any) {

    console.log(`Open dialog for event[${rowData.event_id}]`)

    // ################# //
    // Create the header //
    // ################# //
    let header = (
      this.translationService.getTranslation("user_response_to_event")
    );

    // Event type and details
    header += (
      " '" + this.translationService.getTranslation(
        `EVENT_REQUIRING_ATTENTION_TYPE_${rowData.event_type}`
        ).toLowerCase()
      + "'"
    );

    // Patient name
    header += (
      " "
      + this.translationService.getTranslation("of").toLowerCase()
      + " " + rowData.firstname
      + " " + rowData.lastname
    );

    // ############### //
    // Open the dialog //
    // ############### //
    this.eventRequiringAttentionService.getEventRequiringAttention(rowData.event_id).subscribe(
      eventRequiringAttention => {
        if (eventRequiringAttention != null) {

          const ref = this.dialogService.open(ResponsesToEventComponent, {
            data: {
              "eventRequiringAttention": eventRequiringAttention
            },
            header: header,
            width: '85%'
          });

          ref.onClose.subscribe(res=> {
            this.refreshData();
          })
        }
      }
    );

    // let eventRequiringAttention:EventRequiringAttention = null;
    // const ref = this.dialogService.open(ResponsesToEventComponent, {
    //     data: {
    //       "eventRequiringAttention": eventRequiringAttention
    //     },
    //     header: this.translationService.getTranslation("user_response_to_event"),
    //     width: '70%'
    // });
  }


}
