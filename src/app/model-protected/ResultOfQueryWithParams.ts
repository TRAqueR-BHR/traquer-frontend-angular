import { Utils } from '../util/utils';

export class ResultOfQueryWithParams {
    
    rows:any[];
    totalRecords:number;
    
    constructor(_json:Object) {
        // console.log(_json);
        if (_json == null) {
            return null;
        }
        this.totalRecords = _json['totalRecords'];        
        if (this.totalRecords > 0) {
            this.rows = Utils.convertPlainDataframe(_json['rows']);
        }
    }
    
}


