import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
// import { Observable, observable, of , lastValueFrom, map} from 'rxjs';
import frLocale from '@fullcalendar/core/locales/fr'; // a plugin!
import { lastValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    eventClick: this.handleEventClick.bind(this), // bind is important!
    // eventDrop:this.handleDropEvent.bind(this),
    // eventResize:this.handleResizeEvent.bind(this),
    eventMouseEnter:this.handleEventMouseEnter.bind(this),
    eventMouseLeave:this.handleEventMouseLeave.bind(this),
    // dateClick:this.handleDateClick.bind(this),
    events: this.getAppointments.bind(this),
    locales:[frLocale],
    locale:"fr",
    firstDay:1,
    headerToolbar:{
      start: 'prev,next today title',
      center: '',
      end: 'timeGridDay,listDay timeGridWeek,listWeek dayGridMonth,listMonth'
    },
    editable:true
  };
  
  constructor() { }

  ngOnInit(): void {
    // this.calendarService.getAppointments(new Date("2022-01-01"),new Date("2022-02-01")).subscribe(res => {
    //   console.log(res);
    // })
  }

  // fromAppointmentArrayToEventArray(array: Array<Appointment>): any[] {
  //   let result = array.map(x=>{
  //             let evt = {
  //               title:x.patientLastname,
  //               start:x.start,
  //               end:x.end
  //             }
  //             console.log(evt);
  //             return evt;
  //           });
  //   console.log(result);
  //   return result;
  // }  

  getAppointments(info, successCallback, failureCallback) {
    console.log(info);
    

    // return lastValueFrom(this.calendarService.getAppointments(info.start,info.end)
    //   .pipe(map(res=> this.fromAppointmentArrayToEventArray(res))));

    let events = [
      { title: 'Maryse Peletier CARDIO', 
        start: new Date("2022-02-02T10:00:00Z"),
        end: new Date("2022-02-05T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
      { title: 'François Martin ONCO', 
        start: new Date("2022-02-04T10:00:00Z"),
        end: new Date("2022-02-06T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
      { title: 'Renée Carpe ONCO', 
        start: new Date("2022-02-10T10:00:00Z"),
        end: new Date("2022-02-11T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
      { title: 'André Garabédian (porteur) NEPHRO', 
        start: new Date("2022-02-17T09:00:00Z"),
        end: new Date("2022-02-19T10:00:00Z"),
        color: '#ff5500' },
      { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
        { title: 'Alexandre Marsouin NEPHRO', 
        start: new Date("2022-02-18T10:30:00Z"),
        end: new Date("2022-02-21T15:30:00Z"),
        color: '#e7c819',
        textColor: '#3a3a3a' },
    ]
    return lastValueFrom(of(events));
  }

  handleResizeEvent(e) {
    console.log(e);
  }

  handleDropEvent(e) {
    console.log(e);
  }

  handleEventClick(e) {
    console.log(e);
  }

  handleDateClick(e) {
    console.log(e);
  }

  handleEventMouseEnter(e) {
    console.log(e);
  }

  handleEventMouseLeave(e) {
    console.log(e);
  }

  header = {
    left: 'prev,next today',
    center: 'title',
    right: 'toggleCustodyAppointmentsButton agendaDay,listDay,agendaWeek,listWeek,month,listMonth'
  }; 
}
