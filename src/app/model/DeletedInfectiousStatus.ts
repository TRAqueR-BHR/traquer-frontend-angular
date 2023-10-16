import { Patient } from "./Patient";
import { INFECTIOUS_STATUS_TYPE } from "../enum/INFECTIOUS_STATUS_TYPE";
import { INFECTIOUS_AGENT_CATEGORY } from "../enum/INFECTIOUS_AGENT_CATEGORY";

export class DeletedInfectiousStatus {

    patient:Patient;
    id:string;
    infectiousStatus:INFECTIOUS_STATUS_TYPE;
    refTime:Date;
    infectiousAgent:INFECTIOUS_AGENT_CATEGORY;

    constructor(_json:Object) {
        if (_json['patient'] != null) {
            this.patient = new Patient(_json['patient']);
        }
        this.id = _json['id'];
        if (_json['infectiousStatus'] != null) {
            if (isNaN(Number(_json['infectiousStatus']))) {
                this.infectiousStatus = Number(INFECTIOUS_STATUS_TYPE[_json['infectiousStatus']]);
            } else {
                this.infectiousStatus = Number(_json['infectiousStatus']);
            }
        }
        if (_json['refTime'] != null) {
            if (_json['refTime'] instanceof Date) {
                this.refTime = _json['refTime'];
            } else {
                this.refTime = new Date(_json['refTime']);
            }
        }
        if (_json['infectiousAgent'] != null) {
            if (isNaN(Number(_json['infectiousAgent']))) {
                this.infectiousAgent = Number(INFECTIOUS_AGENT_CATEGORY[_json['infectiousAgent']]);
            } else {
                this.infectiousAgent = Number(_json['infectiousAgent']);
            }
        }
    }

} 