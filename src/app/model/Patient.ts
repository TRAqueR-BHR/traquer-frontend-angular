import { Unit } from "./Unit";
import { PatientNameCrypt } from "./PatientNameCrypt";
import { PatientRefCrypt } from "./PatientRefCrypt";
import { PatientBirthdateCrypt } from "./PatientBirthdateCrypt";
import { GENDER } from "../enum/GENDER";
import { AnalysisResult } from "./AnalysisResult";
import { InfectiousStatus } from "./InfectiousStatus";
import { Stay } from "./Stay";
import { ContactExposure } from "./ContactExposure";

export class Patient {

    currentUnit:Unit;
    patientNameCrypt:PatientNameCrypt;
    patientRefCrypt:PatientRefCrypt;
    patientBirthdateCrypt:PatientBirthdateCrypt;
    id:string;
    isHospitalized:boolean;
    traquerRef:number;
    gender:GENDER;
    analysisResults:AnalysisResult[];
    infectiousStatuses:InfectiousStatus[];
    staies:Stay[];
    contactContactExposures:ContactExposure[];
    carrierContactExposures:ContactExposure[];

    constructor(_json:Object) {
        if (_json['currentUnit'] != null) {
            this.currentUnit = new Unit(_json['currentUnit']);
        }
        if (_json['patientNameCrypt'] != null) {
            this.patientNameCrypt = new PatientNameCrypt(_json['patientNameCrypt']);
        }
        if (_json['patientRefCrypt'] != null) {
            this.patientRefCrypt = new PatientRefCrypt(_json['patientRefCrypt']);
        }
        if (_json['patientBirthdateCrypt'] != null) {
            this.patientBirthdateCrypt = new PatientBirthdateCrypt(_json['patientBirthdateCrypt']);
        }
        this.id = _json['id'];
        this.isHospitalized = _json['isHospitalized'];
        this.traquerRef = _json['traquerRef'];
        if (_json['gender'] != null) {
            this.gender = Number(GENDER[_json['gender']]);
        }
        if (_json['analysisResults'] != null) {
            this.analysisResults = [];
            for (let e of _json['analysisResults']) {
                this.analysisResults.push(new AnalysisResult(e));
            }
        }
        if (_json['infectiousStatuses'] != null) {
            this.infectiousStatuses = [];
            for (let e of _json['infectiousStatuses']) {
                this.infectiousStatuses.push(new InfectiousStatus(e));
            }
        }
        if (_json['staies'] != null) {
            this.staies = [];
            for (let e of _json['staies']) {
                this.staies.push(new Stay(e));
            }
        }
        if (_json['contactContactExposures'] != null) {
            this.contactContactExposures = [];
            for (let e of _json['contactContactExposures']) {
                this.contactContactExposures.push(new ContactExposure(e));
            }
        }
        if (_json['carrierContactExposures'] != null) {
            this.carrierContactExposures = [];
            for (let e of _json['carrierContactExposures']) {
                this.carrierContactExposures.push(new ContactExposure(e));
            }
        }
    }

} 