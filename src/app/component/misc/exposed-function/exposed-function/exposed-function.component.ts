import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ROLE_CODE_NAME } from 'src/app/enum/ROLE_CODE_NAME';
import { ExposedFunctionArgument } from 'src/app/model-protected/ExposedFunctionArgument';
import { ExposedFunction } from 'src/app/model/ExposedFunction';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { TranslationService } from 'src/app/module/translation/service/translation.service';
import { BlockUiService } from 'src/app/service/block-ui.service';
import { ExposedFunctionService } from 'src/app/service/exposed-function.service';
import { SelectItemService } from 'src/app/service/select-item.service';
import { UINotificationService } from 'src/app/service/uinotification.service';

@Component({
  selector: 'app-exposed-function',
  templateUrl: './exposed-function.component.html',
  styleUrls: ['./exposed-function.component.scss']
})
export class ExposedFunctionComponent implements OnInit {

  functions:ExposedFunction[] = [];

  selectedFunction:ExposedFunction;
  arguments:ExposedFunctionArgument[] = [];

  optionsFunctions:SelectItem[] = [];

  constructor(
    private exposedFunctionService:ExposedFunctionService,
    private blockUiService:BlockUiService,
    private notificationsService:UINotificationService,
    private translationService:TranslationService,
  ) { }

  ngOnInit(): void {
    this.getFunctions();
  }

  getFunctions() {

    this.blockUiService.blockUI("this.exposedFunctionService.getFunctions()");

    this.exposedFunctionService.getFunctions().subscribe(res => {

      this.blockUiService.unblockUI("this.exposedFunctionService.getFunctions()");

      if (res != null) {
        this.functions = res;
        this.optionsFunctions = res.map(f => {
          return {
            label:f.prettyName,
            value:f
          }
        });
        // this.functionsOptions = res.map(f => new SelectItem());
      }

    })
  }

  onSelectedFunctionChange(evt) {
    this.arguments = [];
    // console.log(this.selectedFunction.argumentsAsJson);
    let rawArgs = JSON.parse(this.selectedFunction.argumentsAsJson);


    if (rawArgs.length > 0) {
      // Make sure the arguments are in the same order as in the method signature
      rawArgs.sort(function(a, b){return a.rank - b.rank});
      this.arguments = rawArgs.map(rawArg => new ExposedFunctionArgument(rawArg));
    }
  }

  executeFunction() {

    console.log(this.arguments);

    this.blockUiService.blockUI("ExposedFunctionComponent.executeFunction");

    this.exposedFunctionService.execute(this.selectedFunction,this.arguments).subscribe(
      res => {
        this.blockUiService.unblockUI("ExposedFunctionComponent.executeFunction");
        if (res != null) {
          if (res == true) {
            this.notificationsService.notifySuccess(
              this.translationService.getTranslation(
                "function_successfuly_started_you_will_receive_an_email_at_the_end_of_execution"
              )
            );
          }
        }
      }
    );
  }

}
