import { Observable } from "rxjs";
import { ISignalRService } from "./ISignalRService";

export interface ISignalRWEBRtcService extends ISignalRService {
    sendICECandiate(userId: number, iceCandidateData: string);
    receiveICECandidate(): Observable<string>;

    sendOffer(userId: number, offerData: string);
    receiveOffer(): Observable<string>;

    sendAnswer(userId: number, answer: string);
    receiveAnswer(): Observable<string>;

}
