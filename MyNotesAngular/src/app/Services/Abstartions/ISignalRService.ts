export interface ISignalRService {
    IsConnected(): boolean ;
    connectToHub(): void;
}
