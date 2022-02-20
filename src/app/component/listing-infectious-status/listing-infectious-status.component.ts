import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { InfectiousStatusService } from 'src/app/service/infectious-status.service';
import { environment } from 'src/environments/environment';
import { CARRIER_CONTACT } from 'src/app/enum/CARRIER_CONTACT';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';

@Component({
  selector: 'app-listing-infectious-status',
  templateUrl: './listing-infectious-status.component.html',
  styleUrls: ['./listing-infectious-status.component.scss']
})
export class ListingInfectiousStatusComponent implements OnInit {

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
  carrierContactSelectItems:SelectItem[] = [];

  timerOnRefreshDataAfterChangesOnFilter:any;

  constructor(private infectiousStatusService:InfectiousStatusService,
              private translationService:TranslationService,
              private authenticationService:AuthenticationService) { }

  ngOnInit(): void {
    
    this.prepareTrueFalseSelectItems();
    this.prepareCarrierContactSelectItems();
    
    this.intializeTablesPreferences();

  }

  prepareCarrierContactSelectItems(){
     this.carrierContactSelectItems = this.translationService.createSelectItemsFromEnum(CARRIER_CONTACT);
     console.log(this.carrierContactSelectItems);
  }

  prepareTrueFalseSelectItems(){
    this.trueFalseSelectItems.push({label: this.translationService.getTranslation("yes_no"), 
                                value: null});
    this.trueFalseSelectItems.push({label: "OUI", 
                              value: true});     
    this.trueFalseSelectItems.push({label: "NON", 
                              value: false}); 
  }

  intializeTablesPreferences() {

    // Initialize the query params
    this.queryParams = {    
      pageSize:environment.numberOfResultsForDashboard,     
      pageNum:0, 
      cols:[          
        {
          field:"ref_time",
          nameInSelect:"ref_time",
          nameInWhereClause:"_is.ref_time",
          header: "Heure de référence du statut",
          attributeType:"date",
          sortable: true,
          filterable: true,
          columnIsDisplayed:true,
          filterIsActive:false,
          minimumCharactersNeeded:3,
          filterValue:null,
          sorting:null, // null, 1, -1
          sortingRank:null,
          width:"4em"
        },
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
        {
          field:"carrier_contact",
          nameInSelect:"carrier_contact",
          nameInWhereClause:"_is.carrier_contact",
          header: "Porteur ou Contact",
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
        },        
        {
          field:"infectious_status_type_code_name",
          nameInSelect:"infectious_status_type_code_name",
          nameInWhereClause:"ist.code_name",
          header: "Code BHR",
          attributeType:"string",
          sortable: true,
          filterable: true,
          columnIsDisplayed:true,
          filterIsActive:false,
          minimumCharactersNeeded:3,
          filterValue:null,
          sorting:null, // null, 1, -1
          sortingRank:null,
          width:"2em"
        },        
        
        ]
    };

    if (this.authenticationService.getCryptPwd() != null) {
      this.queryParams.cols.push({
        field:"birth_date",
        nameInSelect:"birth_date",
        nameInWhereClause:null,
        header: "Date naissance",
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
      },
      {
        field:"lastname",
        nameInSelect:"lastname",
        nameInWhereClause:"CUSTOM BECAUSE VALUE IS CRYPTED", // The where clause needs special treatment
        header: "Nom",
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
      }
      );
    }

    this.queryParams.cols.push( {
      field: 'view_details',                      
      header: "Voir le détail",      
      columnIsDisplayed:true,  
      width:"2em"          
    });

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
    
    // loval variables for the articial filters
    var typesAnomalies = [];

    let colonnesRetard = ["nb_anomalies_retard","somme_valeurs_moins_seuil_retard","nb_situations_inacceptables_retard"];
    let colonnesAvance = ["nb_anomalies_avance","somme_valeurs_moins_seuil_avance","nb_situations_inacceptables_avance"];
    let colonnesManqueDeRegularite = ["nb_anomalies_manque_de_regularite","somme_valeurs_moins_seuil_manque_de_regularite","nb_situations_inacceptables_manque_de_regularite"];
    let colonnesAbsenceTerminusDepart = ['nb_anomalies_absence_terminus_depart'];
    let colonnesAbsenceTerminusArrivee = ['nb_anomalies_absence_terminus_arrivee'];
    let colonnesAucunArret = ['nb_anomalies_aucun_arret'];

    let colonnesNumeriquesAvecSelecteurBoolees = colonnesRetard.concat(colonnesAvance)
                                                               .concat(colonnesManqueDeRegularite)
                                                               .concat(colonnesAbsenceTerminusDepart)
                                                               .concat(colonnesAbsenceTerminusArrivee)
                                                               .concat(colonnesAucunArret)

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
          if (colonnesNumeriquesAvecSelecteurBoolees.includes(col.field)) {

            if (attrValue == true) {
              col.filterValue = attrValue;
              
  
             
            } // We consider false to be null
            else if (attrValue == false) {
              col.filterValue = null;
            } 
          }        
          // For 'normal' numeric types, just convert to int
          else {
            col.filterIsActive = true;
            col.filterValue = parseInt(attrValue);
          }         

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
    this.infectiousStatusService.getInfectiousStatusForListing(this.queryParams).subscribe(res => {
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
