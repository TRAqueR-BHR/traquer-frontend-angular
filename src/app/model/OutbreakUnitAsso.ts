import { Unit } from "./Unit";
import { Outbreak } from "./Outbreak";
import { Appuser } from "src/app/module/appuser/model/Appuser";

export class OutbreakUnitAsso {

    unit:Unit;
    outbreak:Outbreak;
    creator:Appuser;
    id:string;
    startTime:Date;
    endTime:Date;
    sameRoomOnly:boolean;
    isDefault:boolean;
    comment:string;

    constructor(_json:Object) {
        if (_json['unit'] != null) {
            this.unit = new Unit(_json['unit']);
        }
        if (_json['outbreak'] != null) {
            this.outbreak = new Outbreak(_json['outbreak']);
        }
        if (_json['creator'] != null) {
            this.creator = new Appuser(_json['creator']);
        }
        this.id = _json['id'];
        if (_json['startTime'] != null) {
            if (_json['startTime'] instanceof Date) {
                this.startTime = _json['startTime'];
            } else {
                this.startTime = new Date(_json['startTime']);
            }
        }
        if (_json['endTime'] != null) {
            if (_json['endTime'] instanceof Date) {
                this.endTime = _json['endTime'];
            } else {
                this.endTime = new Date(_json['endTime']);
            }
        }
        this.sameRoomOnly = _json['sameRoomOnly'];
        this.isDefault = _json['isDefault'];
        this.comment = _json['comment'];
    }

} 