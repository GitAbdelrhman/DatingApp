export interface Message {
    id: number;
    senderId: number;
    senderKnownAs: string;
    senderPhotoURL: string;
    recipientId: number;
    recipientKnownAs: string;
    recipientPhotoURL: string;
    content: string;
    isRead: boolean;
    dateReaded: Date;
    messageSent: Date;
}