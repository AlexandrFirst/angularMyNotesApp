export class MessageDto{
    messageId: number;
    messageText: string;
    sendTime: Date;
    isMyMessage: boolean;
}

export enum ChatState{
    StickToBottom,
    Default
}