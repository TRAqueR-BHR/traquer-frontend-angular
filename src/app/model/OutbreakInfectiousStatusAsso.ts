import { Outbreak } from "./Outbreak";
import { InfectiousStatus } from "./InfectiousStatus";

export class OutbreakInfectiousStatusAsso {

    outbreak:Outbreak;
    infectiousStatus:InfectiousStatus;
    id:string;

    constructor(_json:Object) {
        if (_json['outbreak'] != null) {
            this.outbreak = new Outbreak(_json['outbreak']);
        }
        if (_json['infectiousStatus'] != null) {
            this.infectiousStatus = new InfectiousStatus(_json['infectiousStatus']);
        }
        this.id = _json['id'];
    }

} 