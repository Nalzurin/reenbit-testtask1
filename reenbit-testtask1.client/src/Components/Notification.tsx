import type INotificationParams from "../Interfaces/INotificationParams";

export default function Notification({ text, error} : INotificationParams) {
    if (text === null) {
        console.log("Message null");
        return null;
    }
    console.log("Notification Message: ", text);
    console.log("Fail State: ", error);
    let colorStyle = "white";
    if (error) {
        colorStyle = "red";
    } else {
        colorStyle = "green";
    }
    const notificationStyle = {
        fontStyle: "italic",
        fontSize: 16,
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: colorStyle,
    };

    return <div style={ notificationStyle }> { text } </div>;
}