import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-analyses-requests-page',
    templateUrl: './analyses-requests-page.component.html',
    styleUrls: ['./analyses-requests-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AnalysesRequestsPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
