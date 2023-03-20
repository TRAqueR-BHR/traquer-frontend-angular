
export class PatientDecrypt {

    patientId:string;
    firstname:string;
    lastname:string;
    birthdate:string;

    constructor(_json:Object) {

        this.patientId = _json['patientId'];
        this.firstname = _json['firstname'];
        this.lastname = _json['lastname'];
        this.birthdate = _json['birthdate'];

    }

}