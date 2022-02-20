import { Utils } from '../util/utils';

export class ResultOfQueryWithParams {
    
    rows:any[];
    totalRecords:number;
    
    constructor(_json:Object) {
        // console.log(_json);
        this.rows = Utils.convertPlainDataframe(_json['rows']);
        this.totalRecords = _json['totalRecords'];        
    }
    
}


