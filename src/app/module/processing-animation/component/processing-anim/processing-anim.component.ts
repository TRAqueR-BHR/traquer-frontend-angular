import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-processing-anim',
  templateUrl: './processing-anim.component.html',
  styleUrls: ['./processing-anim.component.scss']
})
export class ProcessingAnimComponent implements OnInit {

  visible:boolean = false;

  @Input() withText:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
