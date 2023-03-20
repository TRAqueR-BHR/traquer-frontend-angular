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

    prefixForTranslationId = prefixForTranslationId == null ? "" : prefixForTranslationId;
    suffixForTranslationId = suffixForTranslationId == null ? "" : suffixForTranslationId;

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
        translationId = prefixForTranslationId + enumType[item] + suffixForTranslationId;
      }
      return {
          value: item,
          label: _this.translationService.getTranslation(translationId)
        };
      }));

    return result;
  }

  createSelectItemsForEntities(
    values:any[],
    valueProperty: string|null,
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
          label: _this.createLabelForEntity(item, labelProperty, translate)
        };
      }));
    } else {
      result.push(...values.map(function (item) {
        return {
          value: item,
          label: _this.createLabelForEntity(item, labelProperty, translate)
        };
      }));
    }

    return result;

  }

  createLabelForEntity(item:any,labelProperty:string, translate:boolean = false){

    let _this = this;

    let labelPropertyTree = labelProperty.split(".");
    let unTranslatedLabel = item;
    while (labelPropertyTree.length > 0){
      let _prop = labelPropertyTree.shift();
      console.log(unTranslatedLabel);
      console.log(_prop);
      unTranslatedLabel = unTranslatedLabel[_prop];
    }

    if (translate){
      return _this.translationService.getTranslation(unTranslatedLabel);
    } else {
      return unTranslatedLabel;
    }

  }

}
