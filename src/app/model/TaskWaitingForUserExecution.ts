export class TaskWaitingForUserExecution {

    id:string;
    startTime:Date;
    name:string;
    errorMsg:string;
    creationTime:Date;
    success:boolean;
    endOrErrorTime:Date;

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
        this.errorMsg = _json['errorMsg'];
        if (_json['creationTime'] != null) {
            if (_json['creationTime'] instanceof Date) {
                this.creationTime = _json['creationTime'];
            } else {
                this.creationTime = new Date(_json['creationTime']);
            }
        }
        this.success = _json['success'];
        if (_json['endOrErrorTime'] != null) {
            if (_json['endOrErrorTime'] instanceof Date) {
                this.endOrErrorTime = _json['endOrErrorTime'];
            } else {
                this.endOrErrorTime = new Date(_json['endOrErrorTime']);
            }
        }
    }

} 