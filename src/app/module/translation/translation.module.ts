import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetTranslationPipe } from './pipe/get-translation.pipe';



@NgModule({
  declarations: [GetTranslationPipe],
  imports: [
    CommonModule
  ],
  exports: [
    GetTranslationPipe
  ]
})
export class TranslationModule { }
