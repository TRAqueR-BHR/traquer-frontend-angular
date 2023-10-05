import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/module/translation/service/translation.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private translationService:TranslationService) { }

  ngOnInit(): void {}

}
