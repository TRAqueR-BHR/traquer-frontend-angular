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
            this.inDate = new Date(_json['inDate']);
        }
        if (_json['hospitalizationOutTime'] != null) {
            this.hospitalizationOutTime = new Date(_json['hospitalizationOutTime']);
        }
        if (_json['inTime'] != null) {
            this.inTime = new Date(_json['inTime']);
        }
        if (_json['outTime'] != null) {
            this.outTime = new Date(_json['outTime']);
        }
        if (_json['hospitalizationInTime'] != null) {
            this.hospitalizationInTime = new Date(_json['hospitalizationInTime']);
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