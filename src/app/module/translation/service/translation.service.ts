import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import xml2js from 'xml2js'; // NOTE: 'xml2js' is already a dependecy of angular but 
                             //        we needed to install packages 'stream' and 'timers'

import { LOCALE_ID, Inject } from '@angular/core';
import { Utils } from '../../../util/utils';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  allowedLanguages:string[] = ["en","fr"];
  supportedLanguage:string;
  translations:any = {};
  private translationsLoadedSource = new Subject<boolean>();
  translationsLoaded$ = this.translationsLoadedSource.asObservable();

  translationsForPrimengCalendar:any = {};

  constructor(private http: HttpClient,
              @Inject(LOCALE_ID) protected localeId: string) { }


  getSupportedLanguageCode() {

    return "fr"; // force to French for development (TODO: do better than this)

    if (this.supportedLanguage != null) {
      return this.supportedLanguage;
    }
    // console.log(`this.localeId[${this.localeId}]`);   
    var supportedLanguage = this.localeId;
    if (supportedLanguage.indexOf('-') > 0) {
      supportedLanguage = this.localeId.substr(0, this.localeId.indexOf('-'));
    } 
    if (!this.allowedLanguages.includes(supportedLanguage)) {
      console.log(`language[${supportedLanguage}] is not allowed, we fall back to 'en'`);
      supportedLanguage = "en";
    }    
    // console.log(`supportedLanguage[${supportedLanguage}]`);
    this.supportedLanguage = supportedLanguage;
    return supportedLanguage; 
  }

  getSupportedLanguageCodeForNiceType() {
    const allowedLanguagesForNiceType = ["en","fr"]; // A subset of the languages supported
    const generalSupportedLanguage = this.getSupportedLanguageCode();
    if (!allowedLanguagesForNiceType.includes(generalSupportedLanguage)) {
      return "en";
    } else {
      return generalSupportedLanguage;
    }
  }
  
  getTranslationForPrimengCalendar() {
    var language = this.getSupportedLanguageCode();        
    if (language in this.translationsForPrimengCalendar) {
      return this.translationsForPrimengCalendar[language];
    }    
  }

  getTranslation(translationId:string):string{

    if (translationId == null){
      return "null";
    }

    if (typeof translationId == "boolean") {
      translationId = String(translationId);
    }

    // Remove the optional prefix
    if (translationId.indexOf("i18n@@") > -1) {
      translationId = translationId.replace("i18n@@","");
    } else if (translationId.indexOf("@@") > -1) {
        translationId = translationId.replace("@@","");
    }

    // Convert camel case (eg. creationTime -> creation_time)
    //  by convention we expect only underscore case
    translationId = Utils.camelCaseToUnderscore(translationId);

    // If there is a translation we use it
    if (Object.keys(this.translations).length > 0 && 
      this.translations[translationId] != null) {
        var translationValue = this.translations[translationId];
        return(translationValue);
    } else {
      return(translationId);
    }    

  }

  getSuffixedAttributeName(attrName:string) {
    return (attrName + "_" + this.getSupportedLanguageCode());
  }

  getSuffixedAttributeNameForNiceTypeSUpportedLanguage(attrName:string) {
    return (attrName + "_" + this.getSupportedLanguageCodeForNiceType());
  }
  

  loadTranslations() {

    this.loadPrimengCalendarTranslations();

    // Check if the translation has already been loaded
    if (Object.keys(this.translations).length > 0) {
      console.log("translations already loaded");
      return;
    }

    // Get the current language
    var language = this.getSupportedLanguageCode();
    var url = "assets/translation/messages.xlf";
    if (language != "fr") {
      url = "assets/translation/messages."+ language + ".xlf";
    }
    console.log(url);
    
    return new Promise((resolve, reject) => {
      this.http.get(url, {responseType: 'text'}).subscribe(result => {

        var trans = this.translations;
        var obj = this;
        
        xml2js.parseString(result, function (err, result) {

          // console.log(result["xliff"]["file"][0]);

          for (let o of result["xliff"]["file"][0]["body"]) {
              for (let tu of o["trans-unit"]) {
              // If the file is messages.xlf there is no 'target' tag in it
              if (tu.target != null) {
                obj.translations[tu.$.id] = tu.target[0];
                } else {
                obj.translations[tu.$.id] = tu.source[0];
                }              
              }
          }
          // obj.translationsLoadedSource.next(true);   
          
          resolve(true);

        });
        
        //console.log(result);
      }); // ENDOF  this.http.get(url, {responseType: 'text'}).subscribe()

    }); // ENDOF return new Promise()
  }

  loadPrimengCalendarTranslations() {
    this.translationsForPrimengCalendar["fr"] = {
      firstDayOfWeek: 0,
      dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      dayNamesMin: ["Di","Lu","Ma","Me","Je","Ve","Sa"],
      monthNames: [ "Janvier","Février","Mars","Avril","Mai","Jun","Juillet","Aout","Septembre","Octobre","Novembre","Décembre" ],
      monthNamesShort: [ "Jan", "Fev", "Mar", "Avr", "Mai", "Jun","Jui", "Aou", "Sept", "Oct", "Nov", "Dec" ],
      today: "Aujourd'hui",
      clear: 'Nul'
    };
    // We also define the English version because like this we don't need bother to hide the '[locale]' attribute when the language is English
    this.translationsForPrimengCalendar["en"] = {
      firstDayOfWeek: 0,
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
        monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
        monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
        today: 'Today',
        clear: 'Clear',
    };
  }

  createSelectItemsFromEnum(_enum:any):SelectItem[] {
    let _items:SelectItem[] = [];
    for (let v in _enum) {
      var isValueProperty = parseInt(v, 10) >= 0
      if (isValueProperty) {
        console.log("enum member: ", _enum[v]);
        _items.push({label: this.getTranslation(_enum[v]), 
                     value: _enum[v]});
      }
    }
    return _items;
  }
  

}
