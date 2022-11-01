import * as Moment from 'moment-timezone';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APPUSER_TYPE } from '../enum/APPUSER_TYPE';
import { GENDER } from '../enum/GENDER';
import { HOSPITALIZATION_STATUS_TYPE } from '../enum/HOSPITALIZATION_STATUS_TYPE';
import { INFECTIOUS_STATUS_TYPE } from '../enum/INFECTIOUS_STATUS_TYPE';
import { INFECTIOUS_AGENT_CATEGORY } from '../enum/INFECTIOUS_AGENT_CATEGORY';
import { ROLE_CODE_NAME } from '../enum/ROLE_CODE_NAME';
import { ANALYSIS_REQUEST_STATUS_TYPE } from '../enum/ANALYSIS_REQUEST_STATUS_TYPE';
import { ANALYSIS_REQUEST_TYPE } from '../enum/ANALYSIS_REQUEST_TYPE';
import { ANALYSIS_RESULT_VALUE_TYPE } from '../enum/ANALYSIS_RESULT_VALUE_TYPE';
import { EVENT_REQUIRING_ATTENTION_TYPE } from '../enum/EVENT_REQUIRING_ATTENTION_TYPE';
import { SAMPLE_MATERIAL_TYPE } from '../enum/SAMPLE_MATERIAL_TYPE';
import { RESPONSE_TYPE } from '../enum/RESPONSE_TYPE';

export class Utils {

    constructor() { }    
  
    static convertPlainDataframe(df:any) {

      // console.log(df);
  
      var res:any[] = [];

      // Handle the two types of results that we can get from the julia middleware
      if (df.columns != null) {
        var oneRow:any;
        const nbCols = df.columns.length;
        const nbRows = df.columns[0].length; // get the number of rows from the first column
        const colNames = df.colindex.names;
    
        for (var i = 0; i < nbRows; i++) {
          oneRow = {}; // important to create a new object at every iteration
          for (var j = 0; j < nbCols; j++) {
            oneRow[colNames[j]] = df.columns[j][i];
          }      
          res.push(oneRow);
        }
      } else {

        let colNames = Object.keys(df);
        let nbCols = colNames.length;
        let nbRows = df[colNames[0]].length;

        for (var i = 0; i < nbRows; i++) {
          oneRow = {}; // important to create a new object at every iteration
          for (var j = 0; j < nbCols; j++) {
            oneRow[colNames[j]] = df[colNames[j]][i];
          }      
          res.push(oneRow);
        }
      }  
      //console.log(res);    
      return(res);  
    }

    static getCryptPwdLocalStorageKey() {
      return environment.cryptPwdLocalStorageKey;
    }

    static getCryptPwdHttpHeaderKey() {
      return environment.cryptPwdHttpHeaderKey;
    }

    static camelCaseToUnderscore(str:string):string {
      return(str.replace(/\.?([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, ""));
    }

    static removeDoubleSlashesInURL(url:string):string {
      var set = url.match(/([^:]\/{2,3})/g); // Match (NOT ":") followed by (2 OR 3 "/")

      for (var str in set) {
          // Modify the data you have
          var replace_with = set[str].substr(0, 1) + '/';

          // Replace the match
          url = url.replace(set[str], replace_with);
      }

      return url;
    }
  
    static getDefaultPictureURL():string {
      return "assets/img/dummy.png";
    }
    static getDefaultPictureURLAsObservable():Observable<any> {
      return of("assets/img/dummy.png");
    }

    static getNameOfDatasetPasswordAttributeInLocalStorage(datasetId:string) {
      return `orfead-password-for-dataset-${datasetId}`;
    }
    
    static getNameOfDatasetPasswordHeaderForHttpRequest(datasetId:string) {
      return `x-password-for-dataset-${datasetId}`;
    }

    // Algorithm called Fisher-Yates shuffle. 
    // The idea is to walk the array in the reverse order and swap each element with a random one before it
    static shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    
        // swap elements array[i] and array[j]
        // we use "destructuring assignment" syntax to achieve that
        // you'll find more details about that syntax in later chapters
        // same can be written as:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    static getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    // Eg. Thu Aug 08 2019 00:00:00 GMT+0800 (Singapore Standard Time) -> Thu Aug 08 2019 08:00:00 GMT+0800 (Singapore Standard Time)
    static forceDateToUTC(date:Date){ 
        if (date == null) {
            return null;
        }   
        // console.log(date);
        var dateForcedToUTC = new Date(Date.UTC(date.getFullYear(), 
                                                date.getMonth(), 
                                                date.getDate(),
                                                date.getHours(),
                                                date.getMinutes(),
                                                date.getSeconds()));
        // console.log(dateForcedToUTC);
        return dateForcedToUTC;
    }

    static createDateFromLocaleDate(dateStr:string){
      var date = Moment(dateStr).toDate(); 
      return date;            
    }

    static createDateFromUTCDate(dateStr:string){
        var date = Moment.tz(dateStr, "GMT").toDate();
        return date;            
    }

    static getEnumInts(enumType):number[] {
      var result:number[] = [];
      for (let item in enumType) {
        if (!isNaN(Number(item))) {
            result.push(Number(item));
        }
      }
      return result;
    }

    static getEnumCodeNames(enumType):string[] {
      var result:string[] = [];
      for (let item in enumType) {
        if (isNaN(Number(item))) {
          result.push(item);
        }
      }
      return result;
    }

    static getRandomString(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }

    static getArrayDiff(oldArr:null|any[],newArr:null|any[]):{
      elementsAdded: any[];
      elementsRemoved: any[];
    } {

      if (oldArr == null) {
        oldArr = []
      }
      if (newArr == null) {
        newArr = []
      }

      // Get the items removed
      let elementsRemoved = oldArr.filter(x => !newArr.includes(x));
      
      // Get the items added
      let elementsAdded = newArr.filter(x => !oldArr.includes(x));
      
      return {
        "elementsAdded": elementsAdded,
        "elementsRemoved": elementsRemoved,
      };
    }

    static getEnumName(enumType) {
    
     switch (enumType) {

      case ANALYSIS_REQUEST_STATUS_TYPE:
        return "ANALYSIS_REQUEST_STATUS_TYPE";
        break;
      case ANALYSIS_REQUEST_TYPE:
        return "ANALYSIS_REQUEST_TYPE";
        break;
      case ANALYSIS_RESULT_VALUE_TYPE:
        return "ANALYSIS_RESULT_VALUE_TYPE";
        break;
      case APPUSER_TYPE:
        return "APPUSER_TYPE";
        break;
      case EVENT_REQUIRING_ATTENTION_TYPE:
        return "EVENT_REQUIRING_ATTENTION_TYPE";
        break;
      case GENDER:
        return "GENDER";
        break;
      case HOSPITALIZATION_STATUS_TYPE:
        return "HOSPITALIZATION_STATUS_TYPE";
        break;
      case INFECTIOUS_AGENT_CATEGORY:
        return "INFECTIOUS_AGENT_CATEGORY";
        break;
      case INFECTIOUS_STATUS_TYPE:
        return "INFECTIOUS_STATUS_TYPE";
        break;
      case ROLE_CODE_NAME:
        return "ROLE_CODE_NAME";
        break;
      case SAMPLE_MATERIAL_TYPE:
        return "SAMPLE_MATERIAL_TYPE";
        break;
      case RESPONSE_TYPE:
        return "RESPONSE_TYPE";
        break;
      default:
        throw new Error(`Unknown type[${enumType}]`);          
    }
  }

  static getEnumType(typeName:string) {

    // It is possible that the type name is a julia type with the modules, in the 
    //   typescript world these modules do not exist
    let _elts = typeName.split('.');
    typeName = _elts[_elts.length - 1];
    
    switch (typeName) {

      case "ANALYSIS_REQUEST_STATUS_TYPE":
        return ANALYSIS_REQUEST_STATUS_TYPE;
        break;
      case "ANALYSIS_REQUEST_TYPE":
        return ANALYSIS_REQUEST_TYPE;
        break;
      case "ANALYSIS_RESULT_VALUE_TYPE":
        return ANALYSIS_RESULT_VALUE_TYPE;
        break;
      case "APPUSER_TYPE":
        return APPUSER_TYPE;
        break;
      case "EVENT_REQUIRING_ATTENTION_TYPE":
        return EVENT_REQUIRING_ATTENTION_TYPE;
        break;
      case "GENDER":
        return GENDER;
        break;
      case "HOSPITALIZATION_STATUS_TYPE":
        return HOSPITALIZATION_STATUS_TYPE;
        break;
      case "INFECTIOUS_AGENT_CATEGORY":
        return INFECTIOUS_AGENT_CATEGORY;
        break;
      case "INFECTIOUS_STATUS_TYPE":
        return INFECTIOUS_STATUS_TYPE;
        break;
      case "ROLE_CODE_NAME":
        return ROLE_CODE_NAME;
        break;
      case "SAMPLE_MATERIAL_TYPE":
        return SAMPLE_MATERIAL_TYPE;
        break;
      case "RESPONSE_TYPE":
        return RESPONSE_TYPE;
        break;

      default:
        throw new Error(`Unknown type[${typeName}]`);          
    }
  }


}
  

/**
 * Credit: https://gist.github.com/erikvullings/ada7af09925082cbb89f40ed962d475e
 * Deep copy function for TypeScript.
 * @param T Generic type of target/copied value.
 * @param target Target value to be copied.
 * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
 * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
 */
export const deepCopy = <T>(target: T): T => {
  if (target === null) {
    return target;
  }
  if (target instanceof Date) {
    return new Date(target.getTime()) as any;
  }
  if (target instanceof Array) {
    const cp = [] as any[];
    (target as any[]).forEach((v) => { cp.push(v); });
    return cp.map((n: any) => deepCopy<any>(n)) as any;
  }
  if (typeof target === 'object' && target !== {}) {
    const cp = { ...(target as { [key: string]: any }) } as { [key: string]: any };
    Object.keys(cp).forEach(k => {
      cp[k] = deepCopy<any>(cp[k]);
    });
    return cp as T;
  }
  return target;
};

