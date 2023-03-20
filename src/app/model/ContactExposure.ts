import { Unit } from "./Unit";
import { Patient } from "./Patient";
import { Outbreak } from "./Outbreak";

export class ContactExposure {

    unit:Unit;
    contact:Patient;
    carrier:Patient;
    outbreak:Outbreak;
    id:string;
    startTime:Date;
    endTime:Date;

    constructor(_json:Object) {
        if (_json['unit'] != null) {
            this.unit = new Unit(_json['unit']);
        }
        if (_json['contact'] != null) {
            this.contact = new Patient(_json['contact']);
        }
        if (_json['carrier'] != null) {
            this.carrier = new Patient(_json['carrier']);
        }
        if (_json['outbreak'] != null) {
            this.outbreak = new Outbreak(_json['outbreak']);
        }
        this.id = _json['id'];
        if (_json['startTime'] != null) {
            if (_json['startTime'] instanceof Date) {
                this.startTime = _json['startTime'];
            } else {
                this.startTime = new Date(_json['startTime']);
            }
        }
        if (_json['endTime'] != null) {
            if (_json['endTime'] instanceof Date) {
                this.endTime = _json['endTime'];
            } else {
                this.endTime = new Date(_json['endTime']);
            }
        }
    }

} 