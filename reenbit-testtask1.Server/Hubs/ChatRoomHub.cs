using Microsoft.AspNetCore.SignalR;

namespace reenbit_testtask1.Server.Hubs
{
    public class ChatRoomHub : Hub
    {
        private readonly ReenbitTaskChatroomDatabaseContext _context;
        private readonly TextAnalysisService _textAnalysisService;
        public ChatRoomHub(ReenbitTaskChatroomDatabaseContext context, TextAnalysisService textAnalysisService)
        {
            _context = context;
            _textAnalysisService = textAnalysisService;
        }
        public async Task BroadcastMessage(string name, string message)
        {
            Console.WriteLine($"Name: {name} Message: {message}");
            var sentimentResult = await _textAnalysisService.AnalyzeSentimentAsync(message);
            var msg = new ChatRoomDatabase
            {
                Username = name,
                MessageText = message,
                SentAt = DateTime.UtcNow,
                SentimentLabel = sentimentResult.Sentiment.ToString(),
                ScoreNegative = sentimentResult.ConfidenceScores.Negative,
                ScoreNeutral = sentimentResult.ConfidenceScores.Neutral,
                ScorePositive = sentimentResult.ConfidenceScores.Positive
            };

            var result = _context.ChatRoomDatabases.Add(msg);
            Console.WriteLine(result.Entity.MessageId);
            await _context.SaveChangesAsync();
            await Clients.All.SendAsync("broadcastMessage", result.Entity);
        }
    }
}
