import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RTCMessage } from '../Models/RTCMessage';
import { AccessResponseMessage, ISignalRWEBRtcService } from './Abstartions/ISignalRWEBRtcService';
import { SignalRProvider } from './Providers/SignalRProvider';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {

  private iceCandidateListening = new Subject<RTCMessage>();
  private offerListening = new Subject<RTCMessage>();
  private answerListening = new Subject<string>();
  private accessCallListening = new Subject<number>();
  private reponseCallListening = new Subject<AccessResponseMessage>();
  private declineCallListening = new Subject<void>();

  constructor(
    @Inject(SignalRProvider)
    private signallingServer: ISignalRWEBRtcService) {
    if (!signallingServer.IsConnected()) {
      signallingServer.connectToHub();
    }
  }

  sendICECandidate(userId, iceData) {
    this.signallingServer.sendICECandiate(userId, iceData);
  }

  sendSdpOffer(userId, offer) {
    this.signallingServer.sendSdpOffer(userId, offer);
  }

  sendSdpAnswer(userId, answer) {
    this.signallingServer.sendSdpAnswer(userId, answer);
  }

  receiveICECandidate(): Observable<RTCMessage> {
    this.signallingServer.receiveICECandidate().subscribe(iceCandidateData => {
      this.iceCandidateListening.next(iceCandidateData)
    });

    return this.iceCandidateListening.asObservable();
  }

  receiveOffer(): Observable<RTCMessage> {
    this.signallingServer.receiveOffer().subscribe(offer => {
      this.offerListening.next(offer)
    });

    return this.offerListening.asObservable();
  }

  receiveAnswer(): Observable<string> {
    this.signallingServer.receiveAnswer().subscribe(answer => {
      this.answerListening.next(answer)
    });

    return this.answerListening.asObservable();
  }


  sendAccessRequest(toUserId: number) {
    this.signallingServer.sendAccessRequest(toUserId);
  }
  receiveAccessRequest(): Observable<number> {
    this.signallingServer.receiveAccessRequest().subscribe(fromUserId => {
      this.accessCallListening.next(fromUserId);
    })

    return this.accessCallListening.asObservable();
  }

  sendAccessResponse(toUserId: number, canAccess: boolean) {
    this.signallingServer.sendAccessResponse(toUserId, canAccess);
  }

  receiveAccessResponse(): Observable<AccessResponseMessage> {
    this.signallingServer.receiveAccessResponse().subscribe(accessResponseMessage => {
      this.reponseCallListening.next(accessResponseMessage);
    })

    return this.reponseCallListening.asObservable();
  }

  declineCall(userId){
    this.signallingServer.declineCall(userId);
  }

  getDeclineCallListener(){
    this.signallingServer.recieveDeclineCall().subscribe(() => {
      this.declineCallListening.next();
    })

    return this.declineCallListening.asObservable();
  }

}
