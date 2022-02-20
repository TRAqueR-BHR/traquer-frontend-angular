import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Moment from 'moment-timezone';

@Pipe({ name: 'formatUTC2LocalDate', pure: false })
export class FormatUTC2LocalDatePipe implements PipeTransform {
  constructor() {
  }

  transform(arg) {
    // console.log(Moment.tz('2018-08-07 20:33:30',"GMT").toDate());
    // console.log(arg);
    if (arg == null) {
      return "";
    }
    
    var formattedTime = Moment.utc(arg) // make the date UTC or create a UTC date (in case a string is passed as argument)
      .utcOffset(Moment().utcOffset()) // offset the date with the shift of the current time zone
      .format("YYYY-MM-DD"); // format the date
    // console.log(formattedTime);

    return formattedTime;

  }
}