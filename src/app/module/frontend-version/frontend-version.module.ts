import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppVersionComponent} from './component/app-version/app-version.component'
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AppVersionComponent],  
  imports: [
    CommonModule,

    DialogModule, ButtonModule
  ],
  exports:[AppVersionComponent]
})


export class FrontendVersionModule { 
}
