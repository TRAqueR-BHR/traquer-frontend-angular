import { Patient } from "./Patient";

export class PatientRefCrypt {

    id:string;
    oneChar:string;
    refCrypt:number[];
    patients:Patient[];

    constructor(_json:Object) {
        this.id = _json['id'];
        this.oneChar = _json['oneChar'];
        this.refCrypt = _json['refCrypt'];
        if (_json['patients'] != null) {
            this.patients = [];
            for (let e of _json['patients']) {
                this.patients.push(new Patient(e));
            }
        }
    }

} 