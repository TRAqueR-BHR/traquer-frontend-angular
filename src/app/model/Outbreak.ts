import { Appuser } from "src/app/module/appuser/model/Appuser";
import { OUTBREAK_CRITICITY } from "../enum/OUTBREAK_CRITICITY";
import { INFECTIOUS_AGENT_CATEGORY } from "../enum/INFECTIOUS_AGENT_CATEGORY";
import { OutbreakUnitAsso } from "./OutbreakUnitAsso";
import { ContactExposure } from "./ContactExposure";
import { OutbreakInfectiousStatusAsso } from "./OutbreakInfectiousStatusAsso";

export class Outbreak {

    creator:Appuser;
    id:string;
    criticity:OUTBREAK_CRITICITY;
    name:string;
    infectiousAgent:INFECTIOUS_AGENT_CATEGORY;
    refTime:Date;
    outbreakUnitAssoes:OutbreakUnitAsso[];
    contactExposures:ContactExposure[];
    outbreakInfectiousStatusAssoes:OutbreakInfectiousStatusAsso[];

    constructor(_json:Object) {
        if (_json['creator'] != null) {
            this.creator = new Appuser(_json['creator']);
        }
        this.id = _json['id'];
        if (_json['criticity'] != null) {
            if (isNaN(Number(_json['criticity']))) {
                this.criticity = Number(OUTBREAK_CRITICITY[_json['criticity']]);
            } else {
                this.criticity = Number(_json['criticity']);
            }
        }
        this.name = _json['name'];
        if (_json['infectiousAgent'] != null) {
            if (isNaN(Number(_json['infectiousAgent']))) {
                this.infectiousAgent = Number(INFECTIOUS_AGENT_CATEGORY[_json['infectiousAgent']]);
            } else {
                this.infectiousAgent = Number(_json['infectiousAgent']);
            }
        }
        if (_json['refTime'] != null) {
            if (_json['refTime'] instanceof Date) {
                this.refTime = _json['refTime'];
            } else {
                this.refTime = new Date(_json['refTime']);
            }
        }
        if (_json['outbreakUnitAssoes'] != null) {
            this.outbreakUnitAssoes = [];
            for (let e of _json['outbreakUnitAssoes']) {
                this.outbreakUnitAssoes.push(new OutbreakUnitAsso(e));
            }
        }
        if (_json['contactExposures'] != null) {
            this.contactExposures = [];
            for (let e of _json['contactExposures']) {
                this.contactExposures.push(new ContactExposure(e));
            }
        }
        if (_json['outbreakInfectiousStatusAssoes'] != null) {
            this.outbreakInfectiousStatusAssoes = [];
            for (let e of _json['outbreakInfectiousStatusAssoes']) {
                this.outbreakInfectiousStatusAssoes.push(new OutbreakInfectiousStatusAsso(e));
            }
        }
    }

} 