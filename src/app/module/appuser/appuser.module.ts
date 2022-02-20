import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,Validators,FormControl,FormGroup,FormBuilder, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here

import { TranslationModule} from '../translation/translation.module';

import { SharedModule, MessageService, ConfirmationService } from 'primeng/api';
import { PanelModule } from "primeng/panel";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { CalendarModule } from "primeng/calendar";
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { FieldsetModule } from 'primeng/fieldset';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputMaskModule } from 'primeng/inputmask';
import { ListboxModule } from 'primeng/listbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';
import { EditorModule } from 'primeng/editor';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PasswordModule } from 'primeng/password';
import { SidebarModule } from 'primeng/sidebar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { ChipsModule } from 'primeng/chips';
import { AccordionModule } from 'primeng/accordion';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { LightboxModule } from 'primeng/lightbox';
import { BlockUIModule } from 'primeng/blockui';
import { InplaceModule } from 'primeng/inplace';
import { CardModule } from 'primeng/card';
import {DynamicDialogModule, DynamicDialogRef, DynamicDialogConfig} from 'primeng/dynamicdialog';

import {UserDetailsComponent} from './component/user-details/user-details.component';
import {UserEditComponent} from './component/user-edit/user-edit.component';
import {UsersComponent} from './component/users/users.component';
import { Spe3dlabUtilsModule } from '../spe3dlab-utils/spe3dlab-utils.module';
import { DatasetPasswordComponent } from './component/dataset-password/dataset-password.component';

@NgModule({
  declarations: [UserDetailsComponent,UsersComponent, UserEditComponent,DatasetPasswordComponent],
  imports: [
    CommonModule,

    TranslationModule,
    FormsModule,
    Spe3dlabUtilsModule,

    // PrimeNG
    InputTextModule,InputTextareaModule,PanelModule,MessagesModule,MessageModule,ButtonModule,
    SharedModule,TabViewModule,MenubarModule,DropdownModule, CalendarModule,CheckboxModule,
    SelectButtonModule,MultiSelectModule,RadioButtonModule,TriStateCheckboxModule,
    FieldsetModule,InputSwitchModule,InputMaskModule,ListboxModule,
    OverlayPanelModule,DialogModule,ToggleButtonModule,SliderModule,EditorModule,
    ConfirmDialogModule,PasswordModule,SidebarModule,AutoCompleteModule,
    FileUploadModule,TooltipModule,ChipsModule,AccordionModule,ToastModule, TableModule,
    ScrollPanelModule, LightboxModule,BlockUIModule, DynamicDialogModule,InplaceModule,
    CardModule
  ],
  exports: [
    UserDetailsComponent,UsersComponent
  ],
  providers: []
})
export class AppuserModule { }
