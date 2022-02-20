import { Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/service/role.service';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { ProcessingService } from 'src/app/service/processing.service';
import { environment } from 'src/environments/environment';
import { SelectItem } from 'primeng/api';
import { Utils } from 'src/app/util/utils';
import { APPUSER_TYPE } from 'src/app/enum/APPUSER_TYPE';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  data:any[] = []
  cols: any[];

  pageSize = environment.defaultNumberOfResults;

  appuserTypesSelectItems:SelectItem[] = [];

  constructor(private roleService:RoleService,
              private translationService:TranslationService,
              private processingService:ProcessingService) { }

  ngOnInit() {

    this.processingService.clearProcessesList("RolesComponent.ngOnInit()");   
    this.processingService.blockUI("RolesComponent.ngOnInit()");
    this.prepareAppuserTypesSelectItems();

    this.getRolesForListing();

    this.cols = [
      //{ field: 'code_name', header: this.translationService.getTranslation("code_name") },
      { field: this.translationService.getSuffixedAttributeName('name'), 
        header: this.translationService.getTranslation("name"),
        filterMatchMode: "startsWith" },      
      { field: 'restricted_to_appuser_type', 
        header: this.translationService.getTranslation("user_type") },      
      { field: 'noncomposed_roles_code_names', 
        header: this.translationService.getTranslation("access_rights"),
        filterMatchMode: "contains" },      
      { field: this.translationService.getSuffixedAttributeName('composed_roles_names'), 
        header: this.translationService.getTranslation("roles_delegation_rights"),
        filterMatchMode: "contains" },      
    ];
    // Add the action
    // this.cols.push({ field: 'action', header: "" });
  }

  getRolesForListing() {
    this.roleService.getRolesForListing().subscribe(res => {
      this.processingService.unblockUI("RolesComponent.getRolesForListing()");
      this.data = res;
    });
  }

  prepareAppuserTypesSelectItems(){
    for (let codeName of Utils.getEnumCodeNames(APPUSER_TYPE)) {         
      var label = this.translationService.getTranslation(codeName);
      this.appuserTypesSelectItems.push({label: label, 
                                         value: Number(APPUSER_TYPE[codeName]),                                                       
                                         title: label});
    }
  }

}
