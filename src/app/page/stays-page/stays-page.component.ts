import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-stays-page',
    templateUrl: './stays-page.component.html',
    styleUrls: ['./stays-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class StaysPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
