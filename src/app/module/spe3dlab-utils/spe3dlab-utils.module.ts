import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumCode2EnumNamePipe } from "./pipe/enum-code-2-enum-name.pipe";
import { EscapeHtmlPipe } from "./pipe/escape-html.pipe";
import { FormatUTC2LocalDatePipe } from "./pipe/format-utc2localdate.pipe";
import { FormatUTC2LocalTimePipe } from "./pipe/format-utc2localtime.pipe";



@NgModule({
  declarations: [EnumCode2EnumNamePipe, EscapeHtmlPipe, FormatUTC2LocalDatePipe, FormatUTC2LocalTimePipe],
  imports: [
    CommonModule
  ],
  exports: [
    EnumCode2EnumNamePipe, EscapeHtmlPipe, FormatUTC2LocalDatePipe, FormatUTC2LocalTimePipe
  ]
})
export class Spe3dlabUtilsModule { }
