import { HOSPITALIZATION_STATUS_TYPE } from "../enum/HOSPITALIZATION_STATUS_TYPE";

export class PatientCurrentStatus {

    id:string;
    hospitalizationStatus:HOSPITALIZATION_STATUS_TYPE;

    constructor(_json:Object) {
        this.id = _json['id'];
        if (_json['hospitalizationStatus'] != null) {
            if (isNaN(Number(_json['hospitalizationStatus']))) {
                this.hospitalizationStatus = Number(HOSPITALIZATION_STATUS_TYPE[_json['hospitalizationStatus']]);
            } else {
                this.hospitalizationStatus = Number(_json['hospitalizationStatus']);
            }
        }
    }

} 