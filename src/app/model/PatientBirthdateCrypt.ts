import { Patient } from "./Patient";

export class PatientBirthdateCrypt {

    id:string;
    year:number;
    birthdateCrypt:number[];
    patients:Patient[];

    constructor(_json:Object) {
        this.id = _json['id'];
        this.year = _json['year'];
        this.birthdateCrypt = _json['birthdateCrypt'];
        if (_json['patients'] != null) {
            this.patients = [];
            for (let e of _json['patients']) {
                this.patients.push(new Patient(e));
            }
        }
    }

} 