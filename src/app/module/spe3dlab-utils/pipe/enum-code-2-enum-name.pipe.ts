import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from 'src/app/util/utils';

               
@Pipe({ name: 'enumCode2EnumName', pure: false })
export class EnumCode2EnumNamePipe implements PipeTransform {
  constructor() {
  }

  transform(arg,enumType) {
    
    if (arg == null) {
      return null
    }

    // We may have passed an argument that is aready the enum name,
    //   in which case we do nothing
    if (isNaN(arg)) {
      return arg;
    }
    
    let _type = Utils.getEnumType(enumType);
    return _type[arg];   

  }
}