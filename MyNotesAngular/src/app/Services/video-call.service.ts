import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RTCMessage } from '../Models/RTCMessage';
import { WebRTCService } from './webRTC.service';

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {

  constructor(private webrtcService: WebRTCService) {
  }

 
  iceCandidateSend(userId: number, data: string) {
    this.webrtcService.sendICECandidate(userId, data);
  }

  getIceCandiadate() {
    return this.webrtcService.receiveICECandidate().pipe(map((offer: string) => {
      return JSON.parse(offer) as RTCMessage;
   }));
  }

  sendOffer(userId: number, data: string) {
    this.webrtcService.sendOffer(userId, data);
  }

  getOffer() {
    return this.webrtcService.receiveOffer().pipe(map((offer: string) => {
       return JSON.parse(offer) as RTCMessage;
    }));
  }

  sendAnswer(userId: number, data: string) {
    this.webrtcService.sendAnswer(userId, data);
  }

  getAnswer() {
    return this.webrtcService.receiveAnswer().pipe(map((offer: string) => {
      return JSON.parse(offer) as RTCMessage;
   }));
  }

}
