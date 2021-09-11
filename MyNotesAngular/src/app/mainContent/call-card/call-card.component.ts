import { Component, Input, OnInit } from '@angular/core';
import { UserCallState } from 'src/app/Models/RTCMessage';
import { VideoCallService } from 'src/app/Services/video-call.service';

@Component({
  selector: 'app-call-card',
  templateUrl: './call-card.component.html',
  styleUrls: ['./call-card.component.scss'],
  host: {
    '[style.visibility]': 'isVisible',
  }
})
export class CallCardComponent implements OnInit {

  @Input() isInputCall: boolean = false;
  @Input() userPhotoUrl: string = null;
  @Input() userName: string = null;

  private isVisible: string = 'hidden';

  @Input() set UserState(value: UserCallState) {
    if (value == UserCallState.Calling || value == UserCallState.BeingCalled) {
      console.log("Calling card calling")

      this.isVisible = 'visible';
      
      if (value == UserCallState.Calling) {
        this.isInputCall = false;
      }
      else if (value == UserCallState.BeingCalled) {
        this.isInputCall = true;
      }
    } else {
      this.isVisible = 'hidden';
    }
  }

  constructor(private videoService: VideoCallService) { }

  ngOnInit() {

  }

  acceptCall() {
    this.videoService.userDecision.next(true)
  }

  declineCall() {
    this.videoService.userDecision.next(false)
  }

}
