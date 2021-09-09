import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-card',
  templateUrl: './call-card.component.html',
  styleUrls: ['./call-card.component.scss']
})
export class CallCardComponent implements OnInit {

  @Input() isInputCall: boolean = false;
  @Input() userPhotoUrl: string = null;
  @Input() userName: string = null;

  constructor() { }

  ngOnInit() {
  }

}
