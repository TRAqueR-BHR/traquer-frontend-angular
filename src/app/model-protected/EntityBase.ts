import * as Moment from 'moment-timezone';
import { Appuser } from '../module/appuser/model/Appuser';

export class EntityBase {
    
    className:string; // This is used as workaround because we cannot use 'entity.constructor.name'
                      //   in production because of UglifyJsPlugin (https://github.com/angular/angular-cli/issues/5168)                      
    id: string;    
    creationTime: Date;
    updateTime: Date;
    
    ref:string;

    creator:Appuser;
    lastEditor:Appuser;
        
    constructor(_json:Object) {
        if (_json != null) {
            this.id = _json['id'];    
            this.ref = _json['ref'];    
            if (_json['creationTime'] != null) {    
                // The dates that we receive from the server are at UTC
                this.creationTime = Moment.tz(_json['creationTime'], "GMT").toDate()
            }
            if (_json['updateTime'] != null) {                
                // The dates that we receive from the server are at UTC
                this.updateTime = Moment.tz(_json['updateTime'], "GMT").toDate() 
            }          
            
        }
    }
    

    
}


