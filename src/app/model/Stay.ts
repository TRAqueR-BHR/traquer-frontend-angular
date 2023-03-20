import { Patient } from "./Patient";
import { Unit } from "./Unit";
import { AnalysisResult } from "./AnalysisResult";

export class Stay {

    patient:Patient;
    unit:Unit;
    id:string;
    inDate:Date;
    outTime:Date;
    sysCreationTime:Date;
    hospitalizationOutTime:Date;
    inTime:Date;
    hospitalizationInTime:Date;
    sysProcessingTime:Date;
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
            if (_json['inDate'] instanceof Date) {
                this.inDate = _json['inDate'];
            } else {
                this.inDate = new Date(_json['inDate']);
            }
        }
        if (_json['outTime'] != null) {
            if (_json['outTime'] instanceof Date) {
                this.outTime = _json['outTime'];
            } else {
                this.outTime = new Date(_json['outTime']);
            }
        }
        if (_json['sysCreationTime'] != null) {
            if (_json['sysCreationTime'] instanceof Date) {
                this.sysCreationTime = _json['sysCreationTime'];
            } else {
                this.sysCreationTime = new Date(_json['sysCreationTime']);
            }
        }
        if (_json['hospitalizationOutTime'] != null) {
            if (_json['hospitalizationOutTime'] instanceof Date) {
                this.hospitalizationOutTime = _json['hospitalizationOutTime'];
            } else {
                this.hospitalizationOutTime = new Date(_json['hospitalizationOutTime']);
            }
        }
        if (_json['inTime'] != null) {
            if (_json['inTime'] instanceof Date) {
                this.inTime = _json['inTime'];
            } else {
                this.inTime = new Date(_json['inTime']);
            }
        }
        if (_json['hospitalizationInTime'] != null) {
            if (_json['hospitalizationInTime'] instanceof Date) {
                this.hospitalizationInTime = _json['hospitalizationInTime'];
            } else {
                this.hospitalizationInTime = new Date(_json['hospitalizationInTime']);
            }
        }
        if (_json['sysProcessingTime'] != null) {
            if (_json['sysProcessingTime'] instanceof Date) {
                this.sysProcessingTime = _json['sysProcessingTime'];
            } else {
                this.sysProcessingTime = new Date(_json['sysProcessingTime']);
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