export class FrontendVersion {

    id:string;
    name:string;
    forceReloadIfDifferentVersion:boolean;

    constructor(_json:Object) {
        this.id = _json['id'];
        this.name = _json['name'];
        this.forceReloadIfDifferentVersion = _json['forceReloadIfDifferentVersion'];
    }

} 