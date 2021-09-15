import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RTCMessage } from '../Models/RTCMessage';
import { WebRTCService } from './webRTC.service';

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {

  instantiateCall: Subject<number> = new Subject();

  constructor(private webrtcService: WebRTCService) {
  }


  iceCandidateSend(userId: number, data: string) {
    this.webrtcService.sendICECandidate(userId, data);
  }

  getIceCandiadate() {
    return this.webrtcService.receiveICECandidate().pipe(map((icecandidate: RTCMessage) => {
      return icecandidate;
    }));
  }

  sendOffer(userId: number, data: string) {
    this.webrtcService.sendSdpOffer(userId, data);
  }

  getOffer() {
    return this.webrtcService.receiveOffer().pipe(map((offer: RTCMessage) => {
      return offer;
    }));
  }

  sendAnswer(userId: number, data: string) {
    this.webrtcService.sendSdpAnswer(userId, data);
  }

  getAnswer() {
    return this.webrtcService.receiveAnswer().pipe(map((offer: string) => {
      let obj = offer
      return obj as unknown as RTCMessage;
    }));
  }

  canAccessUserRequest(userId) {
    this.webrtcService.sendAccessRequest(userId);
    return this.webrtcService.receiveAccessResponse();
  }

  canAccessUserResponse() {
    return this.webrtcService.receiveAccessRequest();
  }

  sendAccessResponse(userId, canAccess) {
    this.webrtcService.sendAccessResponse(userId, canAccess);
  }

  declineCall(userId) {
    this.webrtcService.declineCall(userId);
  }

  listenToDeclineCall() {
    return this.webrtcService.getDeclineCallListener();
  }

}
