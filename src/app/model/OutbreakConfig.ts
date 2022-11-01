import { OutbreakConfigUnitAsso } from "./OutbreakConfigUnitAsso";
import { Outbreak } from "./Outbreak";

export class OutbreakConfig {

    id:string;
    isEpidemic:boolean;
    outbreakConfigUnitAssoes:OutbreakConfigUnitAsso[];
    outbreaks:Outbreak[];

    constructor(_json:Object) {
        this.id = _json['id'];
        this.isEpidemic = _json['isEpidemic'];
        if (_json['outbreakConfigUnitAssoes'] != null) {
            this.outbreakConfigUnitAssoes = [];
            for (let e of _json['outbreakConfigUnitAssoes']) {
                this.outbreakConfigUnitAssoes.push(new OutbreakConfigUnitAsso(e));
            }
        }
        if (_json['outbreaks'] != null) {
            this.outbreaks = [];
            for (let e of _json['outbreaks']) {
                this.outbreaks.push(new Outbreak(e));
            }
        }
    }

} 