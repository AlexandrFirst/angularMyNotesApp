import { Component, OnInit } from '@angular/core';
import { Dish } from './core/script.js';
import { add, less } from './controls/script.js';

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.scss',
    './controls/styles.css',
    './core/styles.css']
})
export class VideochatComponent implements OnInit {

  isVideoChatActive = true;
  isVideoOn = true;
  isAudio = true;

  constructor() { }

  ngOnInit() {
    Dish();
    window.onresize = Dish;
  }

  ToggleVideoChat() {
    this.isVideoChatActive = !this.isVideoChatActive;
  }

}
