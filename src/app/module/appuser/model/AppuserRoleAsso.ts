import { Role } from "./Role";
import { EntityBase } from 'src/app/model/EntityBase';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { Appuser } from './Appuser';

export class AppuserRoleAsso extends EntityBase {
    
    appuser:Appuser;
    role:Role;
    
    constructor(_json:Object) {
    //    console.dir(_json);
        // console.log("in DealDistributionChannelAsso construtor");
        super(_json);

        if (_json['appuser'] != null) {
            this.appuser = new Appuser(_json['appuser']);            
        }
        if (_json['role'] != null) {
            this.role = new Role(_json['role']);            
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


