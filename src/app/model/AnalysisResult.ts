import { Patient } from "./Patient";
import { Stay } from "./Stay";
import { AnalysisRefCrypt } from "./AnalysisRefCrypt";
import { SAMPLE_MATERIAL_TYPE } from "../enum/SAMPLE_MATERIAL_TYPE";
import { ANALYSIS_RESULT_VALUE_TYPE } from "../enum/ANALYSIS_RESULT_VALUE_TYPE";
import { ANALYSIS_REQUEST_TYPE } from "../enum/ANALYSIS_REQUEST_TYPE";

export class AnalysisResult {

    patient:Patient;
    stay:Stay;
    analysisRefCrypt:AnalysisRefCrypt;
    id:string;
    sampleMaterialType:SAMPLE_MATERIAL_TYPE;
    requestTime:Date;
    resultTime:Date;
    result:ANALYSIS_RESULT_VALUE_TYPE;
    resultRawText:string;
    requestType:ANALYSIS_REQUEST_TYPE;

    constructor(_json:Object) {
        if (_json['patient'] != null) {
            this.patient = new Patient(_json['patient']);
        }
        if (_json['stay'] != null) {
            this.stay = new Stay(_json['stay']);
        }
        if (_json['analysisRefCrypt'] != null) {
            this.analysisRefCrypt = new AnalysisRefCrypt(_json['analysisRefCrypt']);
        }
        this.id = _json['id'];
        if (_json['sampleMaterialType'] != null) {
            this.sampleMaterialType = Number(SAMPLE_MATERIAL_TYPE[_json['sampleMaterialType']]);
        }
        if (_json['requestTime'] != null) {
            this.requestTime = new Date(_json['requestTime']);
        }
        if (_json['resultTime'] != null) {
            this.resultTime = new Date(_json['resultTime']);
        }
        if (_json['result'] != null) {
            this.result = Number(ANALYSIS_RESULT_VALUE_TYPE[_json['result']]);
        }
        this.resultRawText = _json['resultRawText'];
        if (_json['requestType'] != null) {
            this.requestType = Number(ANALYSIS_REQUEST_TYPE[_json['requestType']]);
        }
    }

} 