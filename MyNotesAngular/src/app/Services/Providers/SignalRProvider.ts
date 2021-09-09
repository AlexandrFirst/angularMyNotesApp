import { InjectionToken } from "@angular/core";
import { SignalRService } from "../SignalR.service";

export const SignalRProvider = new InjectionToken(
    "SignalRProvider",
    { providedIn: "root", factory: () => new SignalRService() }
)