import { Appuser } from "src/app/module/appuser/model/Appuser";
import { Unit } from "./Unit";
import { OutbreakConfig } from "./OutbreakConfig";

export class OutbreakConfigUnitAsso {

    creator:Appuser;
    unit:Unit;
    outbreakConfig:OutbreakConfig;
    id:string;
    startTime:Date;
    endTime:Date;
    sameRoomOnly:boolean;
    isDefault:boolean;
    comment:string;

    constructor(_json:Object) {
        if (_json['creator'] != null) {
            this.creator = new Appuser(_json['creator']);
        }
        if (_json['unit'] != null) {
            this.unit = new Unit(_json['unit']);
        }
        if (_json['outbreakConfig'] != null) {
            this.outbreakConfig = new OutbreakConfig(_json['outbreakConfig']);
        }
        this.id = _json['id'];
        if (_json['startTime'] != null) {
            this.startTime = new Date(_json['startTime']);
        }
        if (_json['endTime'] != null) {
            this.endTime = new Date(_json['endTime']);
        }
        this.sameRoomOnly = _json['sameRoomOnly'];
        this.isDefault = _json['isDefault'];
        this.comment = _json['comment'];
    }

} 