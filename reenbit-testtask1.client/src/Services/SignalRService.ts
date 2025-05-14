import * as signalR from "@microsoft/signalr";
import { useState, useEffect } from "react";
export default function UseSignalR(url: string) {
    const [signalRHub, setSignalRHub] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        const connectionBuilder = new signalR.HubConnectionBuilder();
        connectionBuilder.withUrl(url);
        connectionBuilder.configureLogging(signalR.LogLevel.Debug);
        connectionBuilder.withAutomaticReconnect();
        const connection = connectionBuilder.build();
        async function tryStart() {
            connection.start()
                .then(() => {
                    setSignalRHub(connection);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        tryStart();
        return () => {
            if (connection.state === signalR.HubConnectionState.Connected) {
                connection.stop();
                setSignalRHub(null);
            }
        };
    }, [url]);

    return signalRHub;
}