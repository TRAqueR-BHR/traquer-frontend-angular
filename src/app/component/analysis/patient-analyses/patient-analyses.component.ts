import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { AnalysisResult } from 'src/app/model/AnalysisResult';
import { Outbreak } from 'src/app/model/Outbreak';
import { OutbreakConfig } from 'src/app/model/OutbreakConfig';
import { OutbreakConfigUnitAsso } from 'src/app/model/OutbreakConfigUnitAsso';
import { Patient } from 'src/app/model/Patient';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { AnalysisService } from 'src/app/service/analysis.service';
import { OutbreakConfigService } from 'src/app/service/outbreak-config.service';
import { OutbreakService } from 'src/app/service/outbreak.service';

@Component({
  selector: 'app-patient-analyses',
  templateUrl: './patient-analyses.component.html',
  styleUrls: ['./patient-analyses.component.scss']
})
export class PatientAnalysesComponent implements OnInit {

  @Input()
  patient:Patient;

  analyses:AnalysisResult[];

  optionsYesNo:SelectItem[] = [];

  canDisplaySaveButton:boolean = false;
  debug:boolean = false;

  constructor(
    private translationService:TranslationService,
    private route: ActivatedRoute,
    private analysisService:AnalysisService,
  ) { }

  ngOnInit(): void {
    this.getOptionsYesNo();
    this.setDebuggingComponentFlag();
    
    if (this.patient != null) {
      this.getAnalyses();
    }
    else if (this.debug === true){      
      const patientId = this.route.snapshot.paramMap.get('patientId'); 
      this.getAnalyses();
    }
  }

  getAnalyses() {
    this.analysisService.getAnalysesFromPatient(
      this.patient
    ).subscribe(res => {
      this.analyses = res;
    });
  }

  getOptionsYesNo() {
    this.optionsYesNo = [];
    this.optionsYesNo.push(
      {label: this.translationService.getTranslation("true"), value: true}
    );
    this.optionsYesNo.push(
      {label: this.translationService.getTranslation("false"), value: false}
    );
  }

  setDebuggingComponentFlag() {    
    if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[0].path == "debug3") {
      this.debug = true;
      const patientId = this.route.snapshot.paramMap.get('patientId'); 
      this.patient = new Patient({
        id:patientId
      });
    }
    this.updateDisplayBooleans();
  }

  addAnalysis() {
    
  }

  updateDisplayBooleans() {    
    if (this.debug) {
      this.canDisplaySaveButton = true;
    }
  }

}