import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AccessResponseMessage, ISignalRWEBRtcService } from './Abstartions/ISignalRWEBRtcService';
import { SignalRProvider } from './Providers/SignalRProvider';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {

  private iceCandidateListening = new Subject<string>();
  private offerListening = new Subject<string>();
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

  receiveICECandidate(): Observable<string> {
    this.signallingServer.receiveICECandidate().subscribe(iceCandidateData => {
      this.iceCandidateListening.next(iceCandidateData)
    });

    return this.iceCandidateListening.asObservable();
  }

  receiveOffer(): Observable<string> {
    this.signallingServer.receiveOffer().subscribe(offer => {
      this.offerListening.next(offer)
    });

    return this.offerListening.asObservable();
  }

  receiveAnswer(): Observable<string> {
    this.signallingServer.receiveOffer().subscribe(answer => {
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
