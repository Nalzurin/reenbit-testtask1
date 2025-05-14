import './App.css';
import { useState, useEffect, useRef } from 'react';
import type IChatMessage from './Interfaces/IChatMessage';
import type INotificationParams from './Interfaces/INotificationParams';
import UseSignalR from './Services/SignalRService';
import Notification from './Components/Notification';
export default function App() {
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [user, setUser] = useState("");
    const [currentMessage, setCurrentMessage] = useState("");
    const [notification, setNotification] = useState<INotificationParams>(
        {
            text: "",
            error: false,
        });
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const signalRHub = UseSignalR("https://localhost:7184/chatRoomHub");
    useEffect(() => {
        fetchMessages(0);
        setSkip(25);
    }, []);
    const fetchMessages = async (skipAmount: number) => {
        try {
            const res = await fetch(`https://localhost:7184/api/ChatRoomMessages?skip=${skipAmount}&take=25`);
            console.log("Fetched data:", res);
            const data: IChatMessage[] = (await res.json()).map((msg: IChatMessage) => ({
                ...msg,
                sentAt: new Date(msg.sentAt) // 👈 now it's actually a Date
            }));

            if (data.length < 25) setHasMore(false);
            setMessages(prev => [...data.reverse(), ...prev,]);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            setNotification({ text: "Failed to fetch messages", error: true });
            setTimeout(() => setNotification({ text: "", error: false }), 5000);
        }
    }
    useEffect(() => {
        if (containerRef.current !== null) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);
    useEffect(() => {
        console.log(signalRHub);
        if (signalRHub === null) {
            return;
        }


        const handleBroadcastMessage = (message: IChatMessage) => {
            console.log(message);
            setNotification({ text: "Got message", error: false });
            handleAddMessage(message);
            setTimeout(() => {
                setNotification({ text: "", error: false });
            }, 5000);

        };

        signalRHub.on("broadcastMessage", handleBroadcastMessage);

        return () => {
            signalRHub.off("broadcastMessage", handleBroadcastMessage);
        };
    }, [signalRHub]);
    const handleAddMessage = (message: IChatMessage) => {
        console.log(message.username);
        console.log(message.messageText);
        message.sentAt = new Date(message.sentAt);
        setMessages(prevMessages => [...prevMessages, message]);
    }

    const handleSend = () => {
        if (signalRHub === null) {
            setNotification({ text: "Can't submit message, connection is null", error: true });
            setTimeout(() => {
                setNotification({
                    text: "",
                    error: false,
                });
            }, 5000);
        }
        else {
            console.log("invoking");
            signalRHub.invoke("BroadcastMessage", user, currentMessage)
                .catch((error) => {
                    setNotification({ text: "Can't send message: " + error, error: true });
                    setTimeout(() => {
                        setNotification({
                            text: "",
                            error: false,
                        });
                    }, 5000);
                })
                .then(() => {
                    setCurrentMessage("");

                })
        }

    }
    const handleSetUser = (newName: string) => { setUser(newName); };
    const handleScroll = () => {
        const container = containerRef.current;
        if (!container || !hasMore) return;

        if (container.scrollTop === 0) {
            fetchMessages(skip);
            setSkip(prev => prev + 25);
        }
    };


    if (signalRHub === null) {
        return <div>
            <Notification {...notification} />
            <h1 id="tableLabel">Chat Room</h1>
            <p>Building in progress. Try restarting.</p>
            )
        </div>;
    }
    else {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-4 bg-zinc-900 text-white min-h-screen flex flex-col ">
                <div className="grow-0 shrink-0">
                    <Notification {...notification} />
                </div>
                <div ref={containerRef} onScroll={handleScroll}
                    className="bg-zinc-800 rounded-lg p-4 h-96 overflow-y-auto shadow-inner space-y-3 border border-zinc-700 grow">
                    {messages.length === 0 ? (
                        <p className="text-zinc-400 italic">No messages yet.</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className="bg-zinc-700 p-3 rounded-lg hover:bg-zinc-600 transition-colors">
                                <div className="text-xs text-zinc-400 mb-1">{new Date(msg.sentAt).toLocaleString()}</div>
                                <div>
                                    <span className="font-semibold text-blue-400">{msg.username}</span>{' '}
                                    <span className="text-zinc-100">{msg.messageText}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex-none">
                    <input
                        type="text"
                        placeholder="Your name"
                        value={user}
                        onChange={(e) => handleSetUser(e.target.value)}
                        className="w-full bg-zinc-700 text-white border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <textarea
                    placeholder="Type your message"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-700 text-white border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 resize-none"
                />
                <div className="flex-none">
                    <button
                        onClick={handleSend}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
                    >
                        Send
                    </button>
                </div>

            </div>
        );

    }
}
