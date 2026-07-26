import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Moment from 'moment-timezone';
import { TranslationService } from '../service/translation.service';

@Pipe({
    name: 'getTranslation', pure: false,
    standalone: false
})
export class GetTranslationPipe implements PipeTransform {
  constructor(private translationService:TranslationService) {
  }

  transform(arg) {    
    return this.translationService.getTranslation(arg);
  }
}