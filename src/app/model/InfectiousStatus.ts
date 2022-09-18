import { Patient } from "./Patient";
import { INFECTIOUS_STATUS_TYPE } from "../enum/INFECTIOUS_STATUS_TYPE";
import { ANALYSIS_REQUEST_STATUS_TYPE } from "../enum/ANALYSIS_REQUEST_STATUS_TYPE";
import { INFECTIOUS_AGENT_CATEGORY } from "../enum/INFECTIOUS_AGENT_CATEGORY";
import { OutbreakInfectiousStatusAsso } from "./OutbreakInfectiousStatusAsso";
import { EventRequiringAttention } from "./EventRequiringAttention";

export class InfectiousStatus {

    patient:Patient;
    id:string;
    isCurrent:boolean;
    infectiousStatus:INFECTIOUS_STATUS_TYPE;
    analysisRequestStatus:ANALYSIS_REQUEST_STATUS_TYPE;
    isConfirmed:boolean;
    refTime:Date;
    infectiousAgent:INFECTIOUS_AGENT_CATEGORY;
    outbreakInfectiousStatusAssoes:OutbreakInfectiousStatusAsso[];
    eventRequiringAttentions:EventRequiringAttention[];

    constructor(_json:Object) {
        if (_json['patient'] != null) {
            this.patient = new Patient(_json['patient']);
        }
        this.id = _json['id'];
        this.isCurrent = _json['isCurrent'];
        if (_json['infectiousStatus'] != null) {
            this.infectiousStatus = Number(INFECTIOUS_STATUS_TYPE[_json['infectiousStatus']]);
        }
        if (_json['analysisRequestStatus'] != null) {
            this.analysisRequestStatus = Number(ANALYSIS_REQUEST_STATUS_TYPE[_json['analysisRequestStatus']]);
        }
        this.isConfirmed = _json['isConfirmed'];
        if (_json['refTime'] != null) {
            this.refTime = new Date(_json['refTime']);
        }
        if (_json['infectiousAgent'] != null) {
            this.infectiousAgent = Number(INFECTIOUS_AGENT_CATEGORY[_json['infectiousAgent']]);
        }
        if (_json['outbreakInfectiousStatusAssoes'] != null) {
            this.outbreakInfectiousStatusAssoes = [];
            for (let e of _json['outbreakInfectiousStatusAssoes']) {
                this.outbreakInfectiousStatusAssoes.push(new OutbreakInfectiousStatusAsso(e));
            }
        }
        if (_json['eventRequiringAttentions'] != null) {
            this.eventRequiringAttentions = [];
            for (let e of _json['eventRequiringAttentions']) {
                this.eventRequiringAttentions.push(new EventRequiringAttention(e));
            }
        }
    }

} 