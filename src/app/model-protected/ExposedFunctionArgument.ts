export class ExposedFunctionArgument{
    rank:number;
    prettyName:string;
    juliaTypeName:string;
    isDatabaseCryptPwd:boolean;
    isCurrentUser:boolean;
    value:any;

    constructor(_json:Object) {
        this.rank = _json['rank'];
        this.prettyName = _json['prettyName'];
        this.juliaTypeName = _json['juliaTypeName'];
        this.isDatabaseCryptPwd = _json['isDatabaseCryptPwd'];
        this.isCurrentUser = _json['isCurrentUser'];
        this.value = _json['value'];
    }
}