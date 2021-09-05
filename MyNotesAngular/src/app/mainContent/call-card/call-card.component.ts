import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-card',
  templateUrl: './call-card.component.html',
  styleUrls: ['./call-card.component.scss']
})
export class CallCardComponent implements OnInit {

  isInputCall = false;

  constructor() { }

  ngOnInit() {
  }

}
