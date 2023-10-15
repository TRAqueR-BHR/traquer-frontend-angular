import { Appuser } from "src/app/module/appuser/model/Appuser";
import { Patient } from "./Patient";
import { Unit } from "./Unit";
import { ANALYSIS_REQUEST_STATUS_TYPE } from "../enum/ANALYSIS_REQUEST_STATUS_TYPE";
import { ANALYSIS_REQUEST_TYPE } from "../enum/ANALYSIS_REQUEST_TYPE";

export class AnalysisRequest {

    creator:Appuser;
    patient:Patient;
    lastEditor:Appuser;
    unit:Unit;
    id:string;
    unitExpectedCollectionTime:Date;
    requestTime:Date;
    status:ANALYSIS_REQUEST_STATUS_TYPE;
    requestType:ANALYSIS_REQUEST_TYPE;

    constructor(_json:Object) {
        if (_json['creator'] != null) {
            this.creator = new Appuser(_json['creator']);
        }
        if (_json['patient'] != null) {
            this.patient = new Patient(_json['patient']);
        }
        if (_json['lastEditor'] != null) {
            this.lastEditor = new Appuser(_json['lastEditor']);
        }
        if (_json['unit'] != null) {
            this.unit = new Unit(_json['unit']);
        }
        this.id = _json['id'];
        if (_json['unitExpectedCollectionTime'] != null) {
            if (_json['unitExpectedCollectionTime'] instanceof Date) {
                this.unitExpectedCollectionTime = _json['unitExpectedCollectionTime'];
            } else {
                this.unitExpectedCollectionTime = new Date(_json['unitExpectedCollectionTime']);
            }
        }
        if (_json['requestTime'] != null) {
            if (_json['requestTime'] instanceof Date) {
                this.requestTime = _json['requestTime'];
            } else {
                this.requestTime = new Date(_json['requestTime']);
            }
        }
        if (_json['status'] != null) {
            if (isNaN(Number(_json['status']))) {
                this.status = Number(ANALYSIS_REQUEST_STATUS_TYPE[_json['status']]);
            } else {
                this.status = Number(_json['status']);
            }
        }
        if (_json['requestType'] != null) {
            if (isNaN(Number(_json['requestType']))) {
                this.requestType = Number(ANALYSIS_REQUEST_TYPE[_json['requestType']]);
            } else {
                this.requestType = Number(_json['requestType']);
            }
        }
    }

} 