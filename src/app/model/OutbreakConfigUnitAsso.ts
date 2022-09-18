import { Unit } from "./Unit";
import { OutbreakConfig } from "./OutbreakConfig";

export class OutbreakConfigUnitAsso {

    unit:Unit;
    outbreakConfig:OutbreakConfig;
    id:string;
    startDate:Date;
    endDate:Date;

    constructor(_json:Object) {
        if (_json['unit'] != null) {
            this.unit = new Unit(_json['unit']);
        }
        if (_json['outbreakConfig'] != null) {
            this.outbreakConfig = new OutbreakConfig(_json['outbreakConfig']);
        }
        this.id = _json['id'];
        if (_json['startDate'] != null) {
            this.startDate = new Date(_json['startDate']);
        }
        if (_json['endDate'] != null) {
            this.endDate = new Date(_json['endDate']);
        }
    }

} 