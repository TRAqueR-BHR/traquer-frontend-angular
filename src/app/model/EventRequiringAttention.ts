import { Appuser } from "src/app/module/appuser/model/Appuser";
import { InfectiousStatus } from "./InfectiousStatus";
import { EVENT_REQUIRING_ATTENTION_TYPE } from "../enum/EVENT_REQUIRING_ATTENTION_TYPE";
import { RESPONSE_TYPE } from "../enum/RESPONSE_TYPE";

export class EventRequiringAttention {

    responseUser:Appuser;
    infectiousStatus:InfectiousStatus;
    id:string;
    responseTime:Date;
    responseComment:string;
    isPending:boolean;
    eventType:EVENT_REQUIRING_ATTENTION_TYPE;
    refTime:Date;
    responsesTypes:RESPONSE_TYPE[];

    constructor(_json:Object) {
        if (_json['responseUser'] != null) {
            this.responseUser = new Appuser(_json['responseUser']);
        }
        if (_json['infectiousStatus'] != null) {
            this.infectiousStatus = new InfectiousStatus(_json['infectiousStatus']);
        }
        this.id = _json['id'];
        if (_json['responseTime'] != null) {
            this.responseTime = new Date(_json['responseTime']);
        }
        this.responseComment = _json['responseComment'];
        this.isPending = _json['isPending'];
        if (_json['eventType'] != null) {
            this.eventType = Number(EVENT_REQUIRING_ATTENTION_TYPE[_json['eventType']]);
        }
        if (_json['refTime'] != null) {
            this.refTime = new Date(_json['refTime']);
        }
        if (_json['responsesTypes'] != null) {
            this.responsesTypes = [];
            for (let e of _json['responsesTypes']) {
                this.responsesTypes.push(Number(RESPONSE_TYPE[e]));
            }
        }
    }

} 