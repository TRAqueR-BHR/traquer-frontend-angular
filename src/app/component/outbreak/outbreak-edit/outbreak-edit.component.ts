import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { InfectiousStatus } from 'src/app/model/InfectiousStatus';
import { Outbreak } from 'src/app/model/Outbreak';
import { OutbreakConfig } from 'src/app/model/OutbreakConfig';
import { OutbreakConfigUnitAsso } from 'src/app/model/OutbreakConfigUnitAsso';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { OutbreakConfigService } from 'src/app/service/outbreak-config.service';
import { OutbreakService } from 'src/app/service/outbreak.service';

@Component({
  selector: 'app-outbreak-edit',
  templateUrl: './outbreak-edit.component.html',
  styleUrls: ['./outbreak-edit.component.scss']
})
export class OutbreakEditComponent implements OnInit {

  @Input()
  outbreak:Outbreak;

  @Input()
  infectiousStatus:InfectiousStatus;

  outbreakConfigUnitAssos:OutbreakConfigUnitAsso[];

  optionsYesNo:SelectItem[] = [];

  canDisplaySaveButton:boolean = false;
  canDisplayInitializeOutbreakButton:boolean = false;
  initializeOutbreakBtnIsDisabled:boolean = false;
  debug:boolean = false;

  constructor(
    private translationService:TranslationService,
    private route: ActivatedRoute,
    private outbreakService:OutbreakService,
    private outbreakConfigService:OutbreakConfigService,
  ) { }

  ngOnInit(): void {
    this.getOptionsYesNo();
    this.setDebuggingComponentFlag();
    this.getOutbreak();
  }

  getOutbreak(){
    if (this.outbreak != null && this.outbreak.config != null) {
      this.getOutbreakConfigUnitAssosFromOutbreakConfig();
    }
    else if (this.debug === true){      
      const id = this.route.snapshot.paramMap.get('outbreakId'); 
      this.outbreakService.getOutbreakFromOutbreakFilter(
          new Outbreak({"id":id}),true
        )
        .subscribe(res => {
          this.outbreak = res;
          this.getOutbreakConfigUnitAssosFromOutbreakConfig();
        });
    }
  }

  getOutbreakConfigUnitAssosFromOutbreakConfig() {
    this.outbreakConfigService.getOutbreakConfigUnitAssosFromOutbreakConfig(
      this.outbreak.config
    ).subscribe(res => {
      this.outbreakConfigUnitAssos = res;
      console.log(res);
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
    if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[0].path == "debug2") {
      this.debug = true;
    }
    this.updateDisplayBooleans();
  }

  updateDisplayBooleans() {    
    if (this.debug) {
      this.canDisplaySaveButton = true;
    }
    if (this.outbreak.id == null){
      this.canDisplayInitializeOutbreakButton = true;
    }
  }

  initializeOutbreak(){
    this.initializeOutbreakBtnIsDisabled = true;
    this.outbreakService.initializeOutbreak(this.outbreak.name,this.infectiousStatus)
      .subscribe(res => {
        this.initializeOutbreakBtnIsDisabled = false;
        if (res != null){
          this.outbreak = res;
          this.getOutbreakConfigUnitAssosFromOutbreakConfig();
          this.updateDisplayBooleans();
        }
      });
  }

}
