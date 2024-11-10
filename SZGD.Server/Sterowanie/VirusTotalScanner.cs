using System.Text.Json;
using System.Threading.Tasks;
using RestSharp;

namespace SZGD.Server.Sterowanie
{
    public class VirusTotalScanner
    {
        private const string VirusTotalApiUrl = "https://www.virustotal.com/api/v3/files";
        private const string VirusTotalApiUrlAnalisis = "https://www.virustotal.com/api/v3/analyses/";
        private readonly string _apiKey;

        public VirusTotalScanner(string apiKey)
        {
            _apiKey = apiKey;
        }

        public async Task<bool> ScanFileForMalware(byte[] fileContent)
        {
            var options = new RestClientOptions(VirusTotalApiUrl);
            var client = new RestClient(options);
            var request = new RestRequest("");
            request.AlwaysMultipartFormData = true;
            request.AddHeader("accept", "application/json");
            request.AddHeader("x-apikey", _apiKey);
            request.AddFile("file", fileContent, "file");
            var response = await client.PostAsync(request);
            if (!response.IsSuccessful)
            {
                throw new HttpRequestException("Error scanning file with VirusTotal.");
            }

            // Deserializacja JSON przy użyciu System.Text.Json
            var result = JsonDocument.Parse(response.Content);
            var analysisResults = result.RootElement
                .GetProperty("data")
                .GetProperty("id")
                .ToString();
            var MalwareCount = await GetAnalisis(analysisResults);
            // Zwróć wynik analizy: czy plik został uznany za złośliwy
            return MalwareCount > 0;
        }
        public async Task<Int32> GetAnalisis(string AnalisisId)
        {
            var options = new RestClientOptions(VirusTotalApiUrlAnalisis + AnalisisId);
            var client = new RestClient(options);
            var request = new RestRequest("");
            request.AddHeader("accept", "application/json");
            request.AddHeader("x-apikey", _apiKey);
            var response = await client.GetAsync(request);
            var result = JsonDocument.Parse(response.Content);
            var maliciousCount = result.RootElement
                .GetProperty("data")
                .GetProperty("attributes")
                .GetProperty("stats")
                .GetProperty("malicious")
                .GetInt32();
            return maliciousCount;
        }
    }
}