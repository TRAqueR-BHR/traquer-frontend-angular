import { ROLE_CODE_NAME } from "../enum/ROLE_CODE_NAME";

export class ExposedFunction {

    id:string;
    prettyName:string;
    roles:ROLE_CODE_NAME[];
    juliaName:string;
    argumentsAsJson:string;

    constructor(_json:Object) {
        this.id = _json['id'];
        this.prettyName = _json['prettyName'];
        if (_json['roles'] != null) {
            this.roles = [];
            for (let e of _json['roles']) {
                if (isNaN(Number(e))) {
                    this.roles.push(Number(ROLE_CODE_NAME[e]));
                } else {
                    this.roles.push(Number(e));
                }
            }
        }
        this.juliaName = _json['juliaName'];
        this.argumentsAsJson = _json['argumentsAsJson'];
    }

} 