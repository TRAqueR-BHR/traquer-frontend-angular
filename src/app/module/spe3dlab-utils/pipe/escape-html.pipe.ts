import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'escapeHTML', pure: false })
export class EscapeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(content) {
    if (content == null) {
      return null
    }
    // if (content.includes("<table")){
      let newVal = this.sanitizer.bypassSecurityTrustHtml(content);
      return newVal;
    // }
    // return content;
  }
}