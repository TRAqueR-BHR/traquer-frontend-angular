import { OutbreakConfigUnitAsso } from "./OutbreakConfigUnitAsso";
import { Stay } from "./Stay";
import { ContactExposure } from "./ContactExposure";
import { Patient } from "./Patient";
import { AnalysisRequest } from "./AnalysisRequest";

export class Unit {

    id:string;
    name:string;
    codeName:string;
    outbreakConfigUnitAssoes:OutbreakConfigUnitAsso[];
    staies:Stay[];
    contactExposures:ContactExposure[];
    patients:Patient[];
    analysisRequests:AnalysisRequest[];

    constructor(_json:Object) {
        this.id = _json['id'];
        this.name = _json['name'];
        this.codeName = _json['codeName'];
        if (_json['outbreakConfigUnitAssoes'] != null) {
            this.outbreakConfigUnitAssoes = [];
            for (let e of _json['outbreakConfigUnitAssoes']) {
                this.outbreakConfigUnitAssoes.push(new OutbreakConfigUnitAsso(e));
            }
        }
        if (_json['staies'] != null) {
            this.staies = [];
            for (let e of _json['staies']) {
                this.staies.push(new Stay(e));
            }
        }
        if (_json['contactExposures'] != null) {
            this.contactExposures = [];
            for (let e of _json['contactExposures']) {
                this.contactExposures.push(new ContactExposure(e));
            }
        }
        if (_json['patients'] != null) {
            this.patients = [];
            for (let e of _json['patients']) {
                this.patients.push(new Patient(e));
            }
        }
        if (_json['analysisRequests'] != null) {
            this.analysisRequests = [];
            for (let e of _json['analysisRequests']) {
                this.analysisRequests.push(new AnalysisRequest(e));
            }
        }
    }

} 