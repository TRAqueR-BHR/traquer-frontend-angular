import { AnalysisResult } from "./AnalysisResult";

export class AnalysisRefCrypt {

    id:string;
    oneChar:string;
    refCrypt:number[];
    analysisResults:AnalysisResult[];

    constructor(_json:Object) {
        this.id = _json['id'];
        this.oneChar = _json['oneChar'];
        this.refCrypt = _json['refCrypt'];
        if (_json['analysisResults'] != null) {
            this.analysisResults = [];
            for (let e of _json['analysisResults']) {
                this.analysisResults.push(new AnalysisResult(e));
            }
        }
    }

} 