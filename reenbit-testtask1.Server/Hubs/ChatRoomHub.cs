using Microsoft.AspNetCore.SignalR;

namespace reenbit_testtask1.Server.Hubs
{
    public class ChatRoomHub : Hub
    {
        private readonly ReenbitTaskChatroomDatabaseContext _context;

        public ChatRoomHub(ReenbitTaskChatroomDatabaseContext context)
        {
            _context = context;
        }
        public async Task BroadcastMessage(string name, string message)
        {
            Console.WriteLine($"Name: {name} Message: {message}");
            var msg = new ChatRoomDatabase
            {
                Username = name,
                MessageText = message,
                SentAt = DateTime.UtcNow
            };

            var result = _context.ChatRoomDatabases.Add(msg);
            await _context.SaveChangesAsync();
            await Clients.All.SendAsync("broadcastMessage", result.Entity);
        }

        public Task Echo(string name, string message) =>
            Clients.Client(Context.ConnectionId)
                    .SendAsync("echo", name, $"{message} (echo from server)");
    }
}
