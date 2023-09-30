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
import { formatDate } from '@angular/common';
import { ANALYSIS_REQUEST_TYPE } from 'src/app/enum/ANALYSIS_REQUEST_TYPE';
import { ANALYSIS_RESULT_VALUE_TYPE } from 'src/app/enum/ANALYSIS_RESULT_VALUE_TYPE';
import { SAMPLE_MATERIAL_TYPE } from 'src/app/enum/SAMPLE_MATERIAL_TYPE';
import { AnalysisService } from 'src/app/service/analysis.service';
import { UnitService } from 'src/app/service/unit.service';
import { InfectiousStatusExplanationComponent } from '../../infectious-status/infectious-status-explanation/infectious-status-explanation.component';

@Component({
  selector: 'app-analyses-results',
  templateUrl: './analyses-results.component.html',
  styleUrls: ['./analyses-results.component.scss'],
  providers: [DialogService]
})
export class AnalysesResultsComponent implements OnInit {

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

  timerOnRefreshDataAfterChangesOnFilter:any;

  isDebugMode:boolean = false;

  splitButtonDefPerEventType:any = {};

  actionMenuItemsFor:any = {}; // a Map of (EVENT_REQUIRING_ATTENTION_TYPE => MenuItem[])

  constructor(
    private analysisService:AnalysisService,
    private translationService:TranslationService,
    private enumService:EnumService,
    private selectItemService:SelectItemService,
    private eventRequiringAttentionService:EventRequiringAttentionService,
    public dialogService: DialogService,
    private authenticationService:AuthenticationService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {

    this.isDebugMode = this.authenticationService.isDebugMode();

    this.prepareOptionsTrueFalse();
    this.prepareOptionsANALYSIS_REQUEST_TYPE();
    this.prepareOptionsANALYSIS_RESULT_VALUE_TYPE();
    this.prepareOptionsSAMPLE_MATERIAL_TYPE();
    this.intializeTablesPreferences();

  }

  acknowledgeEvent(rowData:any) {
    console.log(rowData);
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

  prepareOptionsANALYSIS_REQUEST_TYPE() {
    this.enumService.listAllPossibleValues(ANALYSIS_REQUEST_TYPE).subscribe(
      res => {
          this.optionsANALYSIS_REQUEST_TYPE =
            this.selectItemService.createSelectItemsForEnums(
              res,
              ANALYSIS_REQUEST_TYPE,
              false // null options
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
              "ANALYSIS_RESULT_VALUE_TYPE_",
              null
              );
      }
    );
  }

  prepareOptionsSAMPLE_MATERIAL_TYPE() {
    this.enumService.listAllPossibleValues(SAMPLE_MATERIAL_TYPE).subscribe(
      res => {
          this.optionsSAMPLE_MATERIAL_TYPE =
            this.selectItemService.createSelectItemsForEnums(
              res,
              SAMPLE_MATERIAL_TYPE,
              false, // null options
              "SAMPLE_MATERIAL_TYPE_"
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

    // ###################### //
    // AnalysisResult columns //
    // ###################### //
    const idColDef = {
      field:"id",
      nameInSelect:"id",
      nameInWhereClause:"a.id",
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

    const requestTimeColDef = {
      field:"request_time",
      nameInSelect:"request_time",
      nameInWhereClause:"a.request_time",
      header: this.translationService.getTranslation("request_time"),
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

    const resultTimeColDef = {
      field:"result_time",
      nameInSelect:"result_time",
      nameInWhereClause:"a.result_time",
      header: this.translationService.getTranslation("result_time"),
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

    const requestTypeColDef = {
      field:"request_type",
      nameInSelect:"request_type",
      nameInWhereClause:"a.request_type",
      header: this.translationService.getTranslation("request_type"),
      attributeType:"enum",
      enumType: Utils.getEnumName(ANALYSIS_REQUEST_TYPE),
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

    const sampleMaterialTypeColDef = {
      field:"sample_material_type",
      nameInSelect:"sample_material_type",
      nameInWhereClause:"a.sample_material_type",
      header: this.translationService.getTranslation("sample_material_type"),
      attributeType:"enum",
      enumType: Utils.getEnumName(SAMPLE_MATERIAL_TYPE),
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

    const resultColDef = {
      field:"result",
      nameInSelect:"result",
      nameInWhereClause:"a.result",
      header: this.translationService.getTranslation("result"),
      attributeType:"enum",
      enumType: Utils.getEnumName(ANALYSIS_RESULT_VALUE_TYPE),
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
      filterable: false,
      columnIsDisplayed:true,
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
    }

    this.queryParams.cols.push(requestTypeColDef);
    this.queryParams.cols.push(requestTimeColDef);
    this.queryParams.cols.push(resultTimeColDef);
    this.queryParams.cols.push(sampleMaterialTypeColDef);
    this.queryParams.cols.push(resultColDef);

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

    // Copy the values originating from the parent component to the query params
    console.log(this.queryParams);

    this.loading = true;
    this.analysisService.getAnalysesResultsForListing(this.queryParams).subscribe(res => {
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
