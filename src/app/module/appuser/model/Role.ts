import {EntityBase} from "src/app/model/EntityBase";
import { APPUSER_TYPE } from '../enum/APPUSER_TYPE';
import { ROLE_CODE_NAME } from '../enum/ROLE_CODE_NAME';
import { Appuser } from './Appuser';

export class Role  extends EntityBase {
    
    codeName:ROLE_CODE_NAME;
    nameEn:string;
    nameFr:string;    
    description:string;

    composed:boolean;
    restrictedToAppuserType:APPUSER_TYPE;

    without_manager:boolean;

    // TODO: Implement those two if needed
    // # RoleRoleAssos where this role is the handler role
    // roleRoleAssos_as_handler::Union{Missing,Vector{IRoleRoleAsso}}

    // # RoleRoleAssos where this role is the handled role
    // roleRoleAssosAsHandled::Union{Missing,Vector{IRoleRoleAsso}}

    
    constructor(_json:Object) {
        super(_json);
        this.nameEn = _json['nameEn'];
        this.nameFr = _json['nameFr'];
        this.description = _json['description'];
        this.composed = _json['composed'];
        this.without_manager = _json['without_manager'];
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





