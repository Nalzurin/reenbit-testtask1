import * as signalR from "@microsoft/signalr";
import { useState, useEffect } from "react";
export default function UseSignalR(url: string) {
    const [signalRHub, setSignalRHub] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        const connectionBuilder = new signalR.HubConnectionBuilder();
        connectionBuilder.withUrl(url);
        connectionBuilder.configureLogging(signalR.LogLevel.Information)
        const connection = connectionBuilder.build();
        const tryStart = () => {
            connection.start()
                .then(() => {

                    /*                if (optionsRef.current.onConnected)
                                        optionsRef.current.onConnected(hubConnection);
                    
                                    if (optionsRef.current.onDisconnected)
                                        hubConnection.onclose(optionsRef.current.onDisconnected);
                    
                                    if (optionsRef.current.onReconnecting)
                                        hubConnection.onreconnecting(optionsRef.current.onReconnecting);
                    
                                    if (optionsRef.current.onReconnected)
                                        hubConnection.onreconnected(optionsRef.current.onReconnected);
                    
                                    setSignalRHub(hubConnection);*/
                    setSignalRHub(connection);
                })
                .catch((error) => {
                    console.log(error);
                    tryStart();
                });
        }
        tryStart();

    }, [url]);

    return signalRHub;
}