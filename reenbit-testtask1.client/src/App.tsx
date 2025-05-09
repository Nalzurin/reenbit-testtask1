import './App.css';
import { useState } from 'react';
import type IChatMessage from './Interfaces/IChatMessage';
import type INotificationParams from './Interfaces/INotificationParams';
export default function App() {
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [user, setUser] = useState("");
    const [currentMessage, setCurrentMEssage] = useState("");
    const [notification, setNotification] = useState<INotificationParams>(
        {
            text: "",
            error: false,
        });
    const handleSubmit = ({ user, message }: IChatMessage) => {
        if (signalRHub === null) {
            setNotification({ text: "Can't submit message, connection is null", error: true });
        }
        else {
            signalRHub.invoke("SendMessage", user, message)
                .catch((error) => {
                    setNotification({ text: "Can't send message: " + error, error: true });
                })
        }

    }
    const handleSetUser = (newName: string) => { setUser(newName); };

    if (signalRHub === null) {
        return <div>
            <h1 id="tableLabel">Chat Room</h1>
            <p>Building in progress. Try restarting.</p>
            )
        </div>;
    }
    else {
        return (
            <div>

                {messages.map((c, index) => {
                    return (
                        <div key={index}>
                            <p>{c.user}</p>
                            <p>{c.message}</p>
                        </div>
                    );
                })}
            </div>
        );

    }
}
