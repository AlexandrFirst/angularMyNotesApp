import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RTCMessage } from '../Models/RTCMessage';
import { WebRTCService } from './webRTC.service';

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {

  userDecision: ReplaySubject<boolean> = new ReplaySubject(); 

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
    this.webrtcService.sendSdpOffer(userId, data);
  }

  getOffer() {
    return this.webrtcService.receiveOffer().pipe(map((offer: string) => {
      return JSON.parse(offer) as RTCMessage;
    }));
  }

  sendAnswer(userId: number, data: string) {
    this.webrtcService.sendSdpAnswer(userId, data);
  }

  getAnswer() {
    return this.webrtcService.receiveAnswer().pipe(map((offer: string) => {
      return JSON.parse(offer) as RTCMessage;
    }));
  }

  canAccessUserRequest(userId) {
    this.webrtcService.sendAccessRequest(userId);
    return this.webrtcService.receiveAccessResponse();
  }

  canAccessUserReponse() {
    return this.webrtcService.receiveAccessRequest();
  }

  sendAccessReponse(userId, canAccess) {
    this.webrtcService.sendAccessResponse(userId, canAccess);
  }

  askUserToAccept(){
    return this.userDecision.asObservable();
  }

  declineCall(userId){
    this.webrtcService.declineCall(userId);
  }

  listenToDeclineCall(){
    return this.webrtcService.getDeclineCallListener();
  }

}
