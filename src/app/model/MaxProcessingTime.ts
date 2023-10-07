export class MaxProcessingTime {

    id:string;
    maxTime:Date;

    constructor(_json:Object) {
        this.id = _json['id'];
        if (_json['maxTime'] != null) {
            if (_json['maxTime'] instanceof Date) {
                this.maxTime = _json['maxTime'];
            } else {
                this.maxTime = new Date(_json['maxTime']);
            }
        }
    }

} 