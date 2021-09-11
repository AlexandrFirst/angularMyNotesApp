import { Component, Input, OnInit } from '@angular/core';
import { Dish } from './core/script.js';
import { add, less, addMyVideoStream } from './controls/script.js';
import { videoChatData } from 'src/app/Models/videoChatData.js';

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.scss',
    './controls/styles.css',
    './core/styles.css'],
  host: {
    '[style.visibility]': 'isVisible',
  }

})
export class VideochatComponent implements OnInit {

  isVideoChatActive = true;
  isVideoOn = true;
  isAudio = true;
  currentCameraCount: number = 0;
  isVisible: string = 'hidden'

  myVideoChatData: videoChatData | undefined = undefined;

  @Input() set videoChatData(data: videoChatData) {

    console.log(data)
    this.myVideoChatData = data;

    if (this.myVideoChatData && this.myVideoChatData.connectionCount.length > 0) {
      for (let i = 0; i < this.currentCameraCount; i++) {
        less();
        Dish();
      }

      this.currentCameraCount = 0;

      if ( this.myVideoChatData.myVideoTrack ) {
        addMyVideoStream( this.myVideoChatData.myVideoTrack);
        Dish();
        this.currentCameraCount++;
      }


      for (let userId in  this.myVideoChatData.connectionCount) {
        add(data.RemoteVideoStreams[userId],  this.myVideoChatData.RemoteAudioStreams[userId]);
        Dish();
        this.currentCameraCount++;
      }

      if (this.currentCameraCount == 0) {
        this.isVisible = 'hidden'
      } else {
        this.isVisible = 'visible'
      }

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

