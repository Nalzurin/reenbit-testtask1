using Azure.AI.TextAnalytics;
using Azure;

namespace reenbit_testtask1.Server
{
    public class TextAnalysisService
    {
        private readonly TextAnalyticsClient _client;

        public TextAnalysisService(IConfiguration configuration)
        {
            string endpoint = configuration["LANGUAGE_ENDPOINT"];
            string apiKey = configuration["LANGUAGE_KEY"];
            var credentials = new AzureKeyCredential(apiKey);
            _client = new TextAnalyticsClient(new Uri(endpoint), credentials);
        }

        public async Task<DocumentSentiment> AnalyzeSentimentAsync(string text)
        {
            return await _client.AnalyzeSentimentAsync(text);
        }
    }
}
