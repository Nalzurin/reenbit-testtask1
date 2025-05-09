using Microsoft.AspNetCore.SignalR;

namespace reenbit_testtask1.Server.Hubs
{
    public class ChatRoomHub : Hub
    {
        public Task BroadcastMessage(string name, string message) =>
            Clients.All.SendAsync("broadcastMessage", name, message);

        public Task Echo(string name, string message) =>
            Clients.Client(Context.ConnectionId)
                    .SendAsync("echo", name, $"{message} (echo from server)");
    }
}
