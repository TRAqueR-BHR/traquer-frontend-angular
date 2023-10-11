import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as Hash from 'hash.js';
import { Utils } from 'src/app/util/utils';
import { join } from '@angular/compiler-cli/src/ngtsc/file_system';
import { DatasetPasswordService } from 'src/app/service/dataset-password.service';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-dataset-password',
  templateUrl: './dataset-password.component.html',
  styleUrls: ['./dataset-password.component.scss']
})
export class DatasetPasswordComponent implements OnInit {


  canSavePassword:boolean = false;

  minNbOfWordsRequired:number = 5;

  canDisplayClearCryptPwdWidget = false;
  canDisplayCryptPwdInput = false;


  allWords:SelectItem[] = [{label:"toto",
                            value: "toto"},
                            {label:"tata",
                            value: "tata"}];
  selectedWords:string[] = [];

  constructor(private datasetPasswordService:DatasetPasswordService,
              public dynamicDialogRef: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private translationService:TranslationService,
              private authenticationService:AuthenticationService
              ) {

  }

  ngOnInit(): void {
    this.getDatasetUnstructuredConf();
    this.updateDisplayBooleans();
  }

  updateDisplayBooleans() {
    if (this.authenticationService.getCryptPwd() != null) {
      this.canDisplayClearCryptPwdWidget = true;
      this.canDisplayCryptPwdInput = false;
    } else {
      this.canDisplayCryptPwdInput = true;
      this.canDisplayClearCryptPwdWidget = false;
    }
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
      // console.log(Hash.sha512().update('fleurexemple').digest('hex'));
      // console.log(Hash.ripemd160().update('abc').digest('hex'));
      // console.log(res);
      // console.log(Md5.hashStr('blah blah blah'));
      // console.log(Md5.hashAsciiStr('blah blah blah'));
    });
  }

  checkIfCanSavePassword(evt) {
    if (this.selectedWords.length >= this.minNbOfWordsRequired) {
      this.canSavePassword = true;
    } else {
      this.canSavePassword = false;
    }
  }

  generatePasswordHashInLocalStorage() {
    let concatenatedWords = this.selectedWords.join();
    let password = Hash.sha512().update(concatenatedWords).digest('hex')
    localStorage.setItem(
      Utils.getCryptPwdLocalStorageKey(),
      password
    );
    this.updateDisplayBooleans();
    this.dynamicDialogRef.close();
  }

  clearDatasetPassword() {
    localStorage.removeItem(
      Utils.getCryptPwdLocalStorageKey()
    );
    this.selectedWords = [];
    this.updateDisplayBooleans();
  }

}
