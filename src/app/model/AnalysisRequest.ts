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
            if (isNaN(Number(_json['requestType']))) {
                this.requestType = Number(ANALYSIS_REQUEST_TYPE[_json['requestType']]);
            } else {
                this.requestType = Number(_json['requestType']);
            }
        }
        if (_json['creationTime'] != null) {
            if (_json['creationTime'] instanceof Date) {
                this.creationTime = _json['creationTime'];
            } else {
                this.creationTime = new Date(_json['creationTime']);
            }
        }
        if (_json['lastUpdateTime'] != null) {
            if (_json['lastUpdateTime'] instanceof Date) {
                this.lastUpdateTime = _json['lastUpdateTime'];
            } else {
                this.lastUpdateTime = new Date(_json['lastUpdateTime']);
            }
        }
        if (_json['statusType'] != null) {
            if (isNaN(Number(_json['statusType']))) {
                this.statusType = Number(ANALYSIS_REQUEST_STATUS_TYPE[_json['statusType']]);
            } else {
                this.statusType = Number(_json['statusType']);
            }
        }
    }

} 