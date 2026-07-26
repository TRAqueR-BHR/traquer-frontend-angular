import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-other-translations',
    templateUrl: './other-translations.component.html',
    styleUrls: ['./other-translations.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OtherTranslationsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
