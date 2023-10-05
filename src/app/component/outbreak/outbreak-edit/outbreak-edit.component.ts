import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { OUTBREAK_CRITICITY } from 'src/app/enum/OUTBREAK_CRITICITY';
import { InfectiousStatus } from 'src/app/model/InfectiousStatus';
import { Outbreak } from 'src/app/model/Outbreak';
import { OutbreakUnitAsso } from 'src/app/model/OutbreakUnitAsso';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { EnumService } from 'src/app/service/enum.service';
import { OutbreakService } from 'src/app/service/outbreak.service';
import { SelectItemService } from 'src/app/service/select-item.service';
import { UINotificationService } from 'src/app/service/uinotification.service';

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

  outbreakUnitAssos:OutbreakUnitAsso[];

  optionsYesNo:SelectItem[] = [];
  optionsOUTBREAK_CRITICITY:SelectItem[] = [];

  // Display booleans
  canDisplaySaveButton:boolean = false;
  canDisplayInitializeOutbreakButton:boolean = false;
  canDisplaySaveOutbreakButton:boolean = false;
  initializeOutbreakBtnIsDisabled:boolean = false;
  saveOutbreakBtnIsDisabled:boolean = false;s
  debug:boolean = false;

  // Resources loaded checker
  resourcesLoadedChecker = {
    resourcesAreLoaded: false,
    resourcesLoaded:{
      outbreakUnitAssos:false
    }
  }

  constructor(
    private translationService:TranslationService,
    private route: ActivatedRoute,
    private outbreakService:OutbreakService,
    private enumService:EnumService,
    private selectItemService:SelectItemService,
    private notificationService:UINotificationService
  ) { }

  ngOnInit(): void {
    this.getOptionsYesNo();
    this.prepareOptionsOUTBREAK_CRITICITY();
    this.setDebuggingComponentFlag();
    this.getOutbreak();
  }

  ngOnChanges() {
    this.updateDisplayBooleans();
  }

  getOutbreak(){

    console.log(this.outbreak);

    if (this.outbreak != null) {
      this.getOutbreakUnitAssosFromOutbreak();
    }
    else if (this.debug === true){
      const id = this.route.snapshot.paramMap.get('outbreakId');
      this.outbreakService.getOutbreakFromOutbreakFilter(
          new Outbreak({"id":id}),true
        )
        .subscribe(res => {
          this.outbreak = res;
          this.getOutbreakUnitAssosFromOutbreak();
        });
    }
  }

  getOutbreakUnitAssosFromOutbreak() {
    this.outbreakService.getOutbreakUnitAssosFromOutbreak(
      this.outbreak
    ).subscribe(res => {
      this.outbreakUnitAssos = res;

      this.resourcesLoadedChecker.resourcesLoaded.outbreakUnitAssos = true;
      this.updateResourcesLoaded();

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
  }

  updateResourcesLoaded():void {
    for (let k in this.resourcesLoadedChecker) {
      // console.log(this.resourcesLoadedChecker[k]);
      if (this.resourcesLoadedChecker[k] instanceof Object) {
        for (let ksub in this.resourcesLoadedChecker[k]) {
          if (this.resourcesLoadedChecker[k][ksub] == false) {
            this.resourcesLoadedChecker.resourcesAreLoaded = false;
            console.log(`${ksub} is false`);
            return;
          }
        }
      }
    }
    this.resourcesLoadedChecker.resourcesAreLoaded = true;
    this.updateDisplayBooleans();
  }

  updateDisplayBooleans() {
    if (this.outbreak.id == null){
      this.canDisplaySaveButton = false;
      this.canDisplayInitializeOutbreakButton = true;
    } else {
      this.canDisplayInitializeOutbreakButton = false;
      this.canDisplaySaveButton = true;
    }
  }

  initializeOutbreak(){
    this.initializeOutbreakBtnIsDisabled = true;
    this.outbreakService.initializeOutbreak(
        this.outbreak.name,this.infectiousStatus, this.outbreak.criticity, this.outbreak.refTime
      ).subscribe(res => {
        this.initializeOutbreakBtnIsDisabled = false;
        if (res != null){
          this.outbreak = res;
          this.notificationService.notifySuccess("outbreak_initialized");
          this.getOutbreakUnitAssosFromOutbreak();
          this.updateDisplayBooleans();
        }
      });
  }

  save(){
    this.saveOutbreakBtnIsDisabled = true;
    this.outbreakService.save(this.outbreak).subscribe(res => {
      this.saveOutbreakBtnIsDisabled = false;
      if (res != null){
        this.outbreak = res;
        this.notificationService.notifySuccess("outbreak_saved");
        this.getOutbreakUnitAssosFromOutbreak();
        this.updateDisplayBooleans();
      }
    });
  }

  prepareOptionsOUTBREAK_CRITICITY() {
    this.enumService.listAllPossibleValues(OUTBREAK_CRITICITY).subscribe(
      res => {
          this.optionsOUTBREAK_CRITICITY =
            this.selectItemService.createSelectItemsForEnums(
              res,
              OUTBREAK_CRITICITY,
              false, // null options
              "OUTBREAK_CRITICITY_"
              );
      }
    );
  }

}
