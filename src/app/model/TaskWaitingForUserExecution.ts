export class TaskWaitingForUserExecution {

    id:string;
    startTime:Date;
    name:string;
    creationTime:Date;

    constructor(_json:Object) {
        this.id = _json['id'];
        if (_json['startTime'] != null) {
            if (_json['startTime'] instanceof Date) {
                this.startTime = _json['startTime'];
            } else {
                this.startTime = new Date(_json['startTime']);
            }
        }
        this.name = _json['name'];
        if (_json['creationTime'] != null) {
            if (_json['creationTime'] instanceof Date) {
                this.creationTime = _json['creationTime'];
            } else {
                this.creationTime = new Date(_json['creationTime']);
            }
        }
    }

} 