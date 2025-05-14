import type INotificationParams from "../Interfaces/INotificationParams";

export default function Notification({ text, error} : INotificationParams) {
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
        fontSize: 20,
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: colorStyle,
    };

    return <div className="shrink-0 grow-0" style={ notificationStyle }> { text } </div>;
}