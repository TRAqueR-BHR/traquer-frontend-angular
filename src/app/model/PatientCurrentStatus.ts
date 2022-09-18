import { HOSPITALIZATION_STATUS_TYPE } from "../enum/HOSPITALIZATION_STATUS_TYPE";

export class PatientCurrentStatus {

    id:string;
    hospitalizationStatus:HOSPITALIZATION_STATUS_TYPE;

    constructor(_json:Object) {
        this.id = _json['id'];
        if (_json['hospitalizationStatus'] != null) {
            this.hospitalizationStatus = Number(HOSPITALIZATION_STATUS_TYPE[_json['hospitalizationStatus']]);
        }
    }

} 