import { Component, Input, OnInit } from '@angular/core';
import { Dish } from './core/script.js';
import { add, less } from './controls/script.js';
import { videoChatData } from 'src/app/Models/videoChatData.js';

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
  currentCameraCount: number = 0;

  @Input() set videoChatData(data: videoChatData) {
    this.videoChatData = data;

    for (let i = 0; i < this.currentCameraCount; i++) {
      less();
    }
    this.currentCameraCount = 0;

    for (let userId in data.connectionCount) {
      add(data.RemoteVideoStreams[userId], data.RemoteAudioStreams[userId]);
      this.currentCameraCount++;
    }
    
  }

  constructor() { }

  ngOnInit() {
    Dish();
    window.onresize = Dish;
  }

  ToggleVideoChat() {
    this.isVideoChatActive = !this.isVideoChatActive;
  }

}
