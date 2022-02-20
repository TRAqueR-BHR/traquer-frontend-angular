import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Moment from 'moment-timezone';
import { ROLE_CODE_NAME } from 'src/app/module/appuser/enum/ROLE_CODE_NAME';
import { APPUSER_TYPE } from 'src/app/module/appuser/enum/APPUSER_TYPE';

               
@Pipe({ name: 'enumCode2EnumName', pure: false })
export class EnumCode2EnumNamePipe implements PipeTransform {
  constructor() {
  }

  transform(arg,enumType) {
    
    if (arg == null) {
      return "missing"
    }

    // We may have passed an argument that is aready the enum name,
    //   in which case we do nothing
    if (isNaN(arg)) {
      return arg;
    }
    
    if (enumType == "ROLE_CODE_NAME" || enumType == ROLE_CODE_NAME) {
      return ROLE_CODE_NAME[arg];
    } else if (enumType == "APPUSER_TYPE" || enumType == APPUSER_TYPE) {
      return APPUSER_TYPE[arg];
    }
    else {
      throw "Unknown enum type[" + enumType + "]";      
    }

  }
}