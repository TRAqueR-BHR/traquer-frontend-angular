import {EntityBase} from "src/app/model-protected/EntityBase";
import { Appuser } from './Appuser';
import { ROLE_CODE_NAME } from "src/app/enum/ROLE_CODE_NAME";
import { APPUSER_TYPE } from "src/app/enum/APPUSER_TYPE";

export class Role  extends EntityBase {

    codeName:ROLE_CODE_NAME;

    composed:boolean;
    restrictedToAppuserType:APPUSER_TYPE;


    constructor(_json:Object) {
        super(_json);
        this.composed = _json['composed'];
        if (_json['restrictedToAppuserType'] != null) {
            this.restrictedToAppuserType = Number(APPUSER_TYPE[_json['restrictedToAppuserType']]) ;
        }
        if (_json['codeName'] != null) {
            this.codeName = Number(ROLE_CODE_NAME[_json['codeName']]) ;
        }

        // This is here and not in the EntityBase to avoid circular dependencies
        if (_json['creator'] != null) {
            this.creator = new Appuser(_json['creator']);
        }
        if (_json['lastEditor'] != null) {
            this.lastEditor = new Appuser(_json['lastEditor']);
        }
    }

}
