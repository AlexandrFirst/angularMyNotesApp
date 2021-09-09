import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ISignalRWEBRtcService } from './Abstartions/ISignalRWEBRtcService';
import { SignalRProvider } from './Providers/SignalRProvider';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {

  private iceCandidateListening = new Subject<string>();
  private offerListening = new Subject<string>();
  private answerListening = new Subject<string>();

  constructor(
    @Inject(SignalRProvider)
    private signallingServer: ISignalRWEBRtcService) { 
      if(!signallingServer.IsConnected()){
        signallingServer.connectToHub();
      }
    }

  sendICECandidate(userId, iceData) {
    this.signallingServer.sendICECandiate(userId, iceData);
  }

  sendOffer(userId, offer) {
    this.signallingServer.sendOffer(userId, offer);
  }

  sendAnswer(userId, answer){
    this.signallingServer.sendAnswer(userId, answer);
  }

  receiveICECandidate():Observable<string> {
    this.signallingServer.receiveICECandidate().subscribe(iceCandidateData => {
      this.iceCandidateListening.next(iceCandidateData)
    });

    return this.iceCandidateListening.asObservable();
  }

  receiveOffer():Observable<string> {
    this.signallingServer.receiveOffer().subscribe(offer => {
      this.offerListening.next(offer)
    });

    return this.offerListening.asObservable();
  }

  receiveAnswer():Observable<string> {
    this.signallingServer.receiveOffer().subscribe(answer => {
      this.answerListening.next(answer)
    });

    return this.answerListening.asObservable();
  }

}
