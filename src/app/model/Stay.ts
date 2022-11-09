import { Patient } from "./Patient";
import { Unit } from "./Unit";
import { AnalysisResult } from "./AnalysisResult";

export class Stay {

    patient:Patient;
    unit:Unit;
    id:string;
    inDate:Date;
    hospitalizationOutTime:Date;
    inTime:Date;
    outTime:Date;
    hospitalizationInTime:Date;
    room:string;
    analysisResults:AnalysisResult[];

    constructor(_json:Object) {
        if (_json['patient'] != null) {
            this.patient = new Patient(_json['patient']);
        }
        if (_json['unit'] != null) {
            this.unit = new Unit(_json['unit']);
        }
        this.id = _json['id'];
        if (_json['inDate'] != null) {
            if (_json['refTime'] instanceof Date) {
                this.inDate = _json['inDate'];
            } else {
                this.inDate = new Date(_json['inDate']);
            }
        }
        if (_json['hospitalizationOutTime'] != null) {
            if (_json['refTime'] instanceof Date) {
                this.hospitalizationOutTime = _json['hospitalizationOutTime'];
            } else {
                this.hospitalizationOutTime = new Date(_json['hospitalizationOutTime']);
            }
        }
        if (_json['inTime'] != null) {
            if (_json['refTime'] instanceof Date) {
                this.inTime = _json['inTime'];
            } else {
                this.inTime = new Date(_json['inTime']);
            }
        }
        if (_json['outTime'] != null) {
            if (_json['refTime'] instanceof Date) {
                this.outTime = _json['outTime'];
            } else {
                this.outTime = new Date(_json['outTime']);
            }
        }
        if (_json['hospitalizationInTime'] != null) {
            if (_json['refTime'] instanceof Date) {
                this.hospitalizationInTime = _json['hospitalizationInTime'];
            } else {
                this.hospitalizationInTime = new Date(_json['hospitalizationInTime']);
            }
        }
        this.room = _json['room'];
        if (_json['analysisResults'] != null) {
            this.analysisResults = [];
            for (let e of _json['analysisResults']) {
                this.analysisResults.push(new AnalysisResult(e));
            }
        }
    }

} 