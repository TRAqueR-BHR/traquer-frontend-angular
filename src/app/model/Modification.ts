export class Modification {

    id:string;
    newvalue:string;
    oldvalue:string;
    actionId:string;
    creationTime:Date;
    actionType:string;
    attrname:string;
    userId:string;
    entityType:string;
    entityId:string;

    constructor(_json:Object) {
        this.id = _json['id'];
        this.newvalue = _json['newvalue'];
        this.oldvalue = _json['oldvalue'];
        this.actionId = _json['actionId'];
        if (_json['creationTime'] != null) {
            this.creationTime = new Date(_json['creationTime']);
        }
        this.actionType = _json['actionType'];
        this.attrname = _json['attrname'];
        this.userId = _json['userId'];
        this.entityType = _json['entityType'];
        this.entityId = _json['entityId'];
    }

} 