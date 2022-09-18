import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { TranslationService } from '../module/translation/service/translation.service';

@Injectable({
  providedIn: 'root'
})
export class SelectItemService {

  constructor(private translationService:TranslationService) { }


  createSelectItemsForEnums(
    values:any[],
    enumType:any, 
    includeNullOption:boolean = false,
    prefixForTranslationId:string = "",
    suffixForTranslationId:string = "",
    blacklist:any[] = [],
    whitelist:any[] = []) {

    let _this = this;

    // Filter using the whitelist/blacklist
    if (blacklist.length > 0) {
      values = values.filter(x => !blacklist.includes(x));
    } else if (whitelist.length > 0) {
      values = values.filter(x => whitelist.includes(x));
    }

    let result:SelectItem[] = [];
    if (includeNullOption) {
      result.push({
        value: null,
        label: _this.translationService.getTranslation("null_option_label")
      });
    }

    result.push(...values.map(function (item) {

      let translationId = "";
      if (item == null) {
        translationId  = "null_option_label";  
      } else {
        translationId = 
          prefixForTranslationId + enumType[item] + suffixForTranslationId;
      }      
      return {
          value: item,
          label: _this.translationService.getTranslation(translationId)
        };
      }));

    return result;
  }

  createSelectItemsForEntities(
    values:any[],valueProperty: string|null, 
    labelProperty: string, 
    translate: boolean = false,
    includeNullOption:boolean = false) {

    let _this = this;

    let result:SelectItem[] = [];
    if (includeNullOption) {
      result.push({
        value: null,
        label: _this.translationService.getTranslation("null_option_label")
      });
    }

    if (valueProperty!=null) {
      result.push(...values.map(function (item) {
        return {
          value: item[valueProperty],
          label: (translate) ? _this.translationService.getTranslation(item[labelProperty]) : item[labelProperty]
        };
      }));      
    } else {
      result.push(...values.map(function (item) {
        return {
          value: item,
          label: (translate) ? _this.translationService.getTranslation(item[labelProperty]) : item[labelProperty]
        };
      }));      
    }

    return result;
        
  }

}
