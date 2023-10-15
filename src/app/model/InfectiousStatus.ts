import { Patient } from "./Patient";
import { ContactExposure } from "./ContactExposure";
import { INFECTIOUS_AGENT_CATEGORY } from "../enum/INFECTIOUS_AGENT_CATEGORY";
import { ANALYSIS_REQUEST_STATUS_TYPE } from "../enum/ANALYSIS_REQUEST_STATUS_TYPE";
import { INFECTIOUS_STATUS_TYPE } from "../enum/INFECTIOUS_STATUS_TYPE";
import { OutbreakInfectiousStatusAsso } from "./OutbreakInfectiousStatusAsso";
import { EventRequiringAttention } from "./EventRequiringAttention";

export class InfectiousStatus {

    patient:Patient;
    contactExposure:ContactExposure;
    id:string;
    isConfirmed:boolean;
    refTime:Date;
    infectiousAgent:INFECTIOUS_AGENT_CATEGORY;
    analysisRequestStatus:ANALYSIS_REQUEST_STATUS_TYPE;
    updatedRefTime:Date;
    isCancelled:boolean;
    isCurrent:boolean;
    infectiousStatus:INFECTIOUS_STATUS_TYPE;
    outbreakInfectiousStatusAssoes:OutbreakInfectiousStatusAsso[];
    eventRequiringAttentions:EventRequiringAttention[];

    constructor(_json:Object) {
        if (_json['patient'] != null) {
            this.patient = new Patient(_json['patient']);
        }
        if (_json['contactExposure'] != null) {
            this.contactExposure = new ContactExposure(_json['contactExposure']);
        }
        this.id = _json['id'];
        this.isConfirmed = _json['isConfirmed'];
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
        if (_json['analysisRequestStatus'] != null) {
            if (isNaN(Number(_json['analysisRequestStatus']))) {
                this.analysisRequestStatus = Number(ANALYSIS_REQUEST_STATUS_TYPE[_json['analysisRequestStatus']]);
            } else {
                this.analysisRequestStatus = Number(_json['analysisRequestStatus']);
            }
        }
        if (_json['updatedRefTime'] != null) {
            if (_json['updatedRefTime'] instanceof Date) {
                this.updatedRefTime = _json['updatedRefTime'];
            } else {
                this.updatedRefTime = new Date(_json['updatedRefTime']);
            }
        }
        this.isCancelled = _json['isCancelled'];
        this.isCurrent = _json['isCurrent'];
        if (_json['infectiousStatus'] != null) {
            if (isNaN(Number(_json['infectiousStatus']))) {
                this.infectiousStatus = Number(INFECTIOUS_STATUS_TYPE[_json['infectiousStatus']]);
            } else {
                this.infectiousStatus = Number(_json['infectiousStatus']);
            }
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