export class RTCMessage{
    fromUserId: number;
    data: any;
}

export enum UserCallState{Calling, BeingCalled, Idle}