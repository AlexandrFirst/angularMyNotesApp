import { Observable } from "rxjs";
import { ISignalRService } from "./ISignalRService";

export class AccessResponseMessage {
    fromUserId: number;
    canAccess: boolean;
}

export interface ISignalRWEBRtcService extends ISignalRService {
    sendICECandiate(userId: number, iceCandidateData: string);
    receiveICECandidate(): Observable<string>;

    sendSdpOffer(userId: number, offerData: string);
    receiveOffer(): Observable<string>;

    sendSdpAnswer(userId: number, answer: string);
    receiveAnswer(): Observable<string>;

    sendAccessRequest(toUserId: number);
    receiveAccessRequest(): Observable<number>; //observable with number of userId, who reuests access
    sendAccessResponse(toUserId: number, canAccess: boolean);
    receiveAccessResponse(): Observable<AccessResponseMessage>;

    declineCall(userId);
    recieveDeclineCall(): Observable<void>;

}
