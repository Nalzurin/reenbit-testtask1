export default interface IChatMessage {
    "messageId": string;
    "username": string;
    "messageText": string;
    "sentAt": Date;
    "sentimentLabel": string;
    "scorePositive": number;
    "scoreNeutral": number;
    "scoreNegative": number;
}