import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessingAnimComponent } from './component/processing-anim/processing-anim.component';



@NgModule({
  declarations: [
    ProcessingAnimComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProcessingAnimComponent
  ]
})
export class ProcessingAnimationModule { }
