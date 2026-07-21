import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-patient-page',
    templateUrl: './patient-page.component.html',
    styleUrls: ['./patient-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PatientPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
