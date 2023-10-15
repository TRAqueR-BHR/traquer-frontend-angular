import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { ExposedFunctionArgument } from 'src/app/model-protected/ExposedFunctionArgument';
import { Utils } from 'src/app/util/utils';

@Component({
  selector: '[app-exposed-function-argument],app-exposed-function-argument',
  templateUrl: './exposed-function-argument.component.html',
  styleUrls: ['./exposed-function-argument.component.scss'],
  viewProviders: [
    { provide: ControlContainer,
      useExisting: NgForm // This makes the form in the parent component reat as expected
    }
  ]
})
export class ExposedFunctionArgumentComponent implements OnInit {

  @Input()
  argument:ExposedFunctionArgument;

  isDate:boolean = false;
  isBool:boolean = false;

  inputId:string;

  constructor() { }

  ngOnInit(): void {
    this.updateDisplayBooleans();
    this.inputId = Utils.getRandomString("10");
  }

  updateDisplayBooleans() {
    if (["Date","Dates.Date"].includes(this.argument.juliaTypeName)) {
      this.isDate = true;
    }
  }

}
