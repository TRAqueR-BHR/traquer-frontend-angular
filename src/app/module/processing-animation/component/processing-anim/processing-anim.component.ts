import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TranslationService } from 'src/app/module/translation/service/translation.service';

@Component({
    selector: 'app-processing-anim',
    templateUrl: './processing-anim.component.html',
    styleUrls: ['./processing-anim.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProcessingAnimComponent implements OnInit {

  visible:boolean = false;

  @Input() withText:boolean = false;
  @Input() text:string = null;

  constructor(private translationService:TranslationService) { }

  ngOnInit(): void {
    if (this.text == null) {
      this.text = this.translationService.getTranslation("please_wait");
    }
    this.text = this.text + "...";
  }

}
