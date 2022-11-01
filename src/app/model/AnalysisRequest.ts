import { Appuser } from "src/app/module/appuser/model/Appuser";
import { Unit } from "./Unit";
import { ANALYSIS_REQUEST_TYPE } from "../enum/ANALYSIS_REQUEST_TYPE";
import { ANALYSIS_REQUEST_STATUS_TYPE } from "../enum/ANALYSIS_REQUEST_STATUS_TYPE";

export class AnalysisRequest {

    creator:Appuser;
    lastEditor:Appuser;
    unit:Unit;
    id:string;
    requestType:ANALYSIS_REQUEST_TYPE;
    creationTime:Date;
    lastUpdateTime:Date;
    statusType:ANALYSIS_REQUEST_STATUS_TYPE;

    constructor(_json:Object) {
        if (_json['creator'] != null) {
            this.creator = new Appuser(_json['creator']);
        }
        if (_json['lastEditor'] != null) {
            this.lastEditor = new Appuser(_json['lastEditor']);
        }
        if (_json['unit'] != null) {
            this.unit = new Unit(_json['unit']);
        }
        this.id = _json['id'];
        if (_json['requestType'] != null) {
            this.requestType = Number(ANALYSIS_REQUEST_TYPE[_json['requestType']]);
        }
        if (_json['creationTime'] != null) {
            this.creationTime = new Date(_json['creationTime']);
        }
        if (_json['lastUpdateTime'] != null) {
            this.lastUpdateTime = new Date(_json['lastUpdateTime']);
        }
        if (_json['statusType'] != null) {
            this.statusType = Number(ANALYSIS_REQUEST_STATUS_TYPE[_json['statusType']]);
        }
    }

} 