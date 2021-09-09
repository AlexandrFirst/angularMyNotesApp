import { Observable } from "rxjs";
import { ISignalRService } from "./ISignalRService";

export interface ISignalRMessageService extends ISignalRService {
    getFromUserMessage(): Observable<string>;
    sendToUserMessage(userId: number, message: string);
}
