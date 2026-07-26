import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,Validators,FormControl,FormGroup,FormBuilder, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here

import { TranslationModule} from '../translation/translation.module';

import { SharedModule, MessageService, ConfirmationService } from 'primeng/api';
import { PanelModule } from "primeng/panel";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { DatePickerModule } from "primeng/datepicker";
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { MenubarModule } from 'primeng/menubar';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FieldsetModule } from 'primeng/fieldset';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputMaskModule } from 'primeng/inputmask';
import { ListboxModule } from 'primeng/listbox';
import { PopoverModule } from 'primeng/popover';
import { DialogModule } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';
import { EditorModule } from 'primeng/editor';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PasswordModule } from 'primeng/password';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { AccordionModule } from 'primeng/accordion';
import { ScrollPanelModule } from 'primeng/scrollpanel';
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
    InputTextModule,TextareaModule,PanelModule,MessageModule,ButtonModule,
    SharedModule,TabsModule,MenubarModule,SelectModule, DatePickerModule,CheckboxModule,
    SelectButtonModule,MultiSelectModule,RadioButtonModule,FieldsetModule,ToggleSwitchModule,InputMaskModule,ListboxModule,
    PopoverModule,DialogModule,ToggleButtonModule,SliderModule,EditorModule,
    ConfirmDialogModule,PasswordModule,AutoCompleteModule,
    FileUploadModule,TooltipModule,ChipModule,AccordionModule,ToastModule, TableModule,
    ScrollPanelModule, BlockUIModule, DynamicDialogModule,InplaceModule,
    CardModule
  ],
  exports: [
    UserDetailsComponent,UsersComponent
  ],
  providers: []
})
export class AppuserModule { }
