import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { Router } from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import { PatientEditorComponent } from '../patient-editor/patient-editor.component';
import { Patient } from 'src/app/model/Patient';
import { PatientService } from 'src/app/service/patient.service';
import { Utils } from 'src/app/util/utils';
import { INFECTIOUS_STATUS_TYPE } from 'src/app/enum/INFECTIOUS_STATUS_TYPE';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { environment } from 'src/environments/environment';
import { InfectiousStatusEditCompIntService } from 'src/app/service/components-interaction/infectious-status-edit-comp-int.service';
import { PatientDecrypt } from 'src/app/model-protected/PatientDecrypt';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.scss'],
  providers: [DialogService]
})
export class PatientSearchComponent implements OnInit {

  data: any[] = [];
  totalRecords: number = 0;

  // This is a workaround for not being able to reference the 'filterValue' entries in queryParams.cols
  filterValues: any = {};

  loading: boolean;

  queryParams:any = {};
  selectedColumns: string[] = [];
  selectableColumns: SelectItem[] = [];

  timerOnRefreshDataAfterChangesOnFilter:any;

  @Output() selectionEvent = new EventEmitter<any>();

  // Display control
  @Input()  displayMode:string = "patientsList"; // Possible values: examList, calendar
  @Input() scrollHeight:string = "75vh";
  paginator:boolean = true;

  constructor(
    private router:Router,
    public translationService: TranslationService,
    public patientService: PatientService,
    private authenticationService: AuthenticationService,
    public dialogService: DialogService,
    private infectiousStatusEditCompIntService:InfectiousStatusEditCompIntService) { }

  ngOnInit(): void {
    this.intializeTablesPreferences();
  }

  intializeTablesPreferences() {

    // Initialize the query params
    this.queryParams = {
      pageSize:environment.numberOfResultsForDashboard,
      pageNum:0,
      cols:[
        ]
    };

  
    // ############### //
    // Patient columns //
    // ############### //
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
      filterable: false,
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
      sorting:null, // null, 1, -1`
      sortingRank:null,
      width:"4em"
    };


    // ############### //
    // Add the columns //
    // ############### //
    if (this.authenticationService.getCryptPwd() != null) {
      this.queryParams.cols.push(firstnameColDef);
      this.queryParams.cols.push(lastnameColDef);
      this.queryParams.cols.push(birthdateColDef);
    }
    this.queryParams.cols.push(patientIsHospitalizedColDef);
    this.queryParams.cols.push(patientCurrentUnitNameColDef);
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


  displayDialogForNewPatient() {
    const ref = this.dialogService.open(PatientEditorComponent, {
        data: {
          asDialog: true
        },
        header: this.translationService.getTranslation("new_patient"),
        width: '70%'
    });

    ref.onClose.subscribe((_newPatient:Patient) => {
      var colPatientId = this.queryParams.cols.filter(x => x.field == "patient_id")[0] ;
      colPatientId.filterValue = _newPatient.id;
      colPatientId.filterable = true;
      colPatientId.filterIsActive = true;
      this.refreshData();
    });
  }

  onAddPatientBtnClick(event) {
    // this.goToPatientPage("new");
    this.displayDialogForNewPatient();
  }

  onPatientBtnClick(event) {
    console.log(event);
  }

  
  goToExamPage(examId:string) {
    this.router.navigateByUrl(`/exam/${examId}`);
  }

  goToPatientPage(patientId:string) {
    this.router.navigateByUrl(`/patient/${patientId}`);
  }

  announcePatientSelected(rowData:any){
    console.log(rowData);
    let patientDecrypt = new PatientDecrypt({
      patientId: rowData.patient_id,
      firstname:rowData.firstname,
      lastname: rowData.lastname,
      birthdate: rowData.birthdate,
    });
    this.infectiousStatusEditCompIntService.announcePatientSelected(patientDecrypt);
  }

  onRowSelect(event) {
    console.log(event);
    if (this.displayMode == "calendar") {
      this.selectionEvent.emit(event.data);
    } else {
      this.goToPatientPage(event.data.patient_id);
    }
  }

  // We cannot  use the default 'onLazyLoad' function to update the filters
  //   because we initialize the filters input. Because of this the event passed
  //   to the function doesnt contain the filters that are not null but not modified
  updateFiltering(andRefrehData:boolean = true) {

    // local variables for the artificial filters
    var typesAnomalies = [];

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
    this.patientService.getPatientsForListing(this.queryParams).subscribe(res => {
      if (res!= null) {

        console.log(res);

        this.data = res.rows;
        console.log(this.data);
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

}
