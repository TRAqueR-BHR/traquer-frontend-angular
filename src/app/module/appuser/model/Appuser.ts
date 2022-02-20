import { Role } from "./Role";
import { EntityBase } from 'src/app/model/EntityBase';
import { AppuserRoleAsso } from './AppuserRoleAsso';
import { APPUSER_TYPE } from '../enum/APPUSER_TYPE';

export class Appuser extends EntityBase {
    
    login: string;
    password: string;    
    jwt: string;

    firstname: string;
    lastname: string;
    phone:string;
    email: string;
    fullname:string; // built in constructor
    
    appuserAppuserRoleAssoes:AppuserRoleAsso[];
    allRoles:Role[];   

    appuserType:APPUSER_TYPE;

    languageCode:string;
    avatar:File;
    deactivated:boolean;
    
    constructor(_json:Object) {
//        console.dir(_json);
        // console.log("in Appuser construtor");
        super(_json);
        this.login = _json['login'];
        this.password = _json['password'];
        this.jwt = _json['jwt'];

        this.firstname = _json['firstname'];
        this.lastname = _json['lastname'];  
        this.phone = _json['phone'];  
        this.email = _json['email'];

        this.fullname = this.firstname + " " + this.lastname;

        this.appuserAppuserRoleAssoes = [];
        if (_json['appuserAppuserRoleAssoes'] != null) {
            for (let e of _json['appuserAppuserRoleAssoes']) {
                this.appuserAppuserRoleAssoes.push(new AppuserRoleAsso(e));
            }
        }
        this.allRoles = [];
        if (_json['allRoles'] != null) {
            for (let e of _json['allRoles']) {
                this.allRoles.push(new Role(e));
            }
        }
        this.deactivated = _json['deactivated'];        
        this.languageCode = _json['languageCode'];

        if (_json['appuserType'] != null) {
            // console.log(_json['appuserType']);
            this.appuserType = Number(APPUSER_TYPE[_json['appuserType']]) ;        
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


