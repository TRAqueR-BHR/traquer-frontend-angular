import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-exposed-function-page',
    templateUrl: './exposed-function-page.component.html',
    styleUrls: ['./exposed-function-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExposedFunctionPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
