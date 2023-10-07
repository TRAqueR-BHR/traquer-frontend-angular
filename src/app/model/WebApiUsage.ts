import { Appuser } from "./Appuser";

export class WebApiUsage {

    user:Appuser;
    id:string;
    inTime:Date;
    outTime:Date;
    apiUrl:string;

    constructor(_json:Object) {
        if (_json['user'] != null) {
            this.user = new Appuser(_json['user']);
        }
        this.id = _json['id'];
        if (_json['inTime'] != null) {
            if (_json['inTime'] instanceof Date) {
                this.inTime = _json['inTime'];
            } else {
                this.inTime = new Date(_json['inTime']);
            }
        }
        if (_json['outTime'] != null) {
            if (_json['outTime'] instanceof Date) {
                this.outTime = _json['outTime'];
            } else {
                this.outTime = new Date(_json['outTime']);
            }
        }
        this.apiUrl = _json['apiUrl'];
    }

} 