import { OutbreakConfig } from "./OutbreakConfig";
import { INFECTIOUS_AGENT_CATEGORY } from "../enum/INFECTIOUS_AGENT_CATEGORY";
import { ContactExposure } from "./ContactExposure";
import { OutbreakInfectiousStatusAsso } from "./OutbreakInfectiousStatusAsso";

export class Outbreak {

    config:OutbreakConfig;
    id:string;
    name:string;
    infectiousAgent:INFECTIOUS_AGENT_CATEGORY;
    contactExposures:ContactExposure[];
    outbreakInfectiousStatusAssoes:OutbreakInfectiousStatusAsso[];

    constructor(_json:Object) {
        if (_json['config'] != null) {
            this.config = new OutbreakConfig(_json['config']);
        }
        this.id = _json['id'];
        this.name = _json['name'];
        if (_json['infectiousAgent'] != null) {
            this.infectiousAgent = Number(INFECTIOUS_AGENT_CATEGORY[_json['infectiousAgent']]);
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