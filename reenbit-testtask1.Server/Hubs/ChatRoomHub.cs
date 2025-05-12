using Microsoft.AspNetCore.SignalR;

namespace reenbit_testtask1.Server.Hubs
{

    public class ChatRoomHub : Hub
    {
        public async Task BroadcastMessage(string name, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", name, message);
        }

        public Task Echo(string name, string message) =>
            Clients.Client(Context.ConnectionId)
                    .SendAsync("echo", name, $"{message} (echo from server)");
    }
}
