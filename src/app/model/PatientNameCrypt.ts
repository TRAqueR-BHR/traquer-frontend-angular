import { Patient } from "./Patient";

export class PatientNameCrypt {

    id:string;
    lastnameFirstLetter:string;
    firstnameCrypt:number[];
    lastnameForCpCrypt:number[];
    firstnameForCpCrypt:number[];
    lastnameCrypt:number[];
    patients:Patient[];

    constructor(_json:Object) {
        this.id = _json['id'];
        this.lastnameFirstLetter = _json['lastnameFirstLetter'];
        this.firstnameCrypt = _json['firstnameCrypt'];
        this.lastnameForCpCrypt = _json['lastnameForCpCrypt'];
        this.firstnameForCpCrypt = _json['firstnameForCpCrypt'];
        this.lastnameCrypt = _json['lastnameCrypt'];
        if (_json['patients'] != null) {
            this.patients = [];
            for (let e of _json['patients']) {
                this.patients.push(new Patient(e));
            }
        }
    }

} 