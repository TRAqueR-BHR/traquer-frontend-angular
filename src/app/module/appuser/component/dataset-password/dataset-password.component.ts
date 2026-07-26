import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Utils } from 'src/app/util/utils';
import { DatasetPasswordService } from 'src/app/service/dataset-password.service';
import { MasterKeyService } from 'src/app/service/master-key.service';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { UINotificationService } from 'src/app/service/uinotification.service';

@Component({
    selector: 'app-dataset-password',
    templateUrl: './dataset-password.component.html',
    styleUrls: ['./dataset-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DatasetPasswordComponent implements OnInit {


  canSavePassword:boolean = false;
  waitingForEndOfAction:boolean = false;

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
              private uiNotificationService:UINotificationService,
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
    if (!this.canSavePassword || this.waitingForEndOfAction) {
      return;
    }

    this.waitingForEndOfAction = true;

    this.masterKeyService.checkMasterKeyIsValid(this.selectedWords).subscribe(isValid => {
      if (!isValid) {
        this.waitingForEndOfAction = false;
        this.uiNotificationService.notifyWarn(
          "La combinaison de mots sélectionnée est invalide."
        );
        return;
      }

      this.masterKeyService.setMasterKey(this.selectedWords).subscribe(success => {
        this.waitingForEndOfAction = false;

        if (success) {
          this.uiNotificationService.notifySuccess(
            "Le mot de passe du jeu de données a été enregistré."
          );
          this.dynamicDialogRef.close();
        } else {
          this.uiNotificationService.notifyWarn(
            "Le mot de passe du jeu de données n'a pas pu être enregistré."
          );
        }
      });
    });
  }

}