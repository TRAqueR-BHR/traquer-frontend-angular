import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Utils } from 'src/app/util/utils';
import { DatasetPasswordService } from 'src/app/service/dataset-password.service';
import { MasterKeyService } from 'src/app/service/master-key.service';
import { TranslationService } from 'src/app/module/translation/service/translation.service';

@Component({
    selector: 'app-dataset-password',
    templateUrl: './dataset-password.component.html',
    styleUrls: ['./dataset-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DatasetPasswordComponent implements OnInit {


  canSavePassword:boolean = false;

  minNbOfWordsRequired:number = 5;


  allWords:SelectItem[] = [{label:"toto",
                            value: "toto"},
                            {label:"tata",
                            value: "tata"}];
  selectedWords:string[] = [];

  constructor(private datasetPasswordService:DatasetPasswordService,
              private masterKeyService:MasterKeyService,
              public dynamicDialogRef: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private translationService:TranslationService,
              ) {

  }

  ngOnInit(): void {
    this.getDatasetUnstructuredConf();
  }

  getDatasetUnstructuredConf() {
    this.datasetPasswordService.getWordsList(this.translationService.getSupportedLanguageCode()).subscribe(res => {
      if (res != null) {
        this.allWords = [];
        for (let w of res) {

          this.allWords.push({
            // Remove accents from the label, to workaround the problem of the search not
            //   behaving as expected for accented characters
            label: w.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
            value: w
          })

        }
        Utils.shuffle(this.allWords);
      }
    });
  }

  checkIfCanSavePassword(evt) {
    if (this.selectedWords.length >= this.minNbOfWordsRequired) {
      this.canSavePassword = true;
    } else {
      this.canSavePassword = false;
    }
  }

  sendMasterKeyToServer() {
    this.masterKeyService.setMasterKey(this.selectedWords).subscribe(success => {
      if (success) {
        this.dynamicDialogRef.close();
      }
    });
  }

}