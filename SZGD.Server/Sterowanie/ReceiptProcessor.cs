using Azure.AI.FormRecognizer;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Azure.AI.DocumentIntelligence;
using Azure.Core;
using System;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using Azure.AI.DocumentIntelligence;
using Azure;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.IO;
using System.Text;
using IronOcr;
namespace Azure;
public class ReceiptProcessor
{
    private static string endpoint = "https://szgd.cognitiveservices.azure.com";
    private static string apiKey = "2iBemidnYyqJ6GDRmNhzL4OIn7vKGPDa3gJZDNFzYmRHjgIJ7u3lJQQJ99AKACYeBjFXJ3w3AAALACOGzA1o";
    public string ProcessReceiptImage(string filePath)
    {
        var receiptData = new ReceiptData();

        var ocr = new IronTesseract { Language = OcrLanguage.Polish };

        using (var input = new OcrInput(filePath))
        {
            var result = ocr.Read(input);
            var text = result.Text;
            Console.WriteLine(text);
            return text;
        }
    }
    public static Stream ConvertStringToStream(string inputString)
    {
        // Convert the string to a byte array using UTF-8 encoding (default)
        byte[] byteArray = Encoding.UTF8.GetBytes(inputString);

        // Create a MemoryStream from the byte array
        MemoryStream stream = new MemoryStream(byteArray);

        // Optionally, reset the position to the beginning of the stream if needed
        stream.Position = 0;

        return stream;
    }
    
    public async Task<ReceiptData> ProcessAI(Stream fileStream)
    { 
        var client = new DocumentAnalysisClient(new Uri("https://szgd.cognitiveservices.azure.com"), new AzureKeyCredential("2iBemidnYyqJ6GDRmNhzL4OIn7vKGPDa3gJZDNFzYmRHjgIJ7u3lJQQJ99AKACYeBjFXJ3w3AAALACOGzA1o"));

        // Wczytaj obraz paragonu
        // Rozpocznij analizę dokumentu - używamy 'prebuilt-receipt' (przygotowanego modelu do paragonów)
        var operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-receipt", fileStream);
        var result = await operation.WaitForCompletionAsync();

        // Zainicjalizuj obiekt ReceiptData
        var receiptData = new ReceiptData();

        // Przetwarzaj wyniki analizy
        foreach (var document in result.Value.Documents)
        {
            if (document.Fields.ContainsKey("MerchantName"))
            {
                receiptData.StoreName = document.Fields["MerchantName"].Value.AsString();
            }

            if (document.Fields.ContainsKey("TransactionDate"))
            {
                receiptData.Date = document.Fields["TransactionDate"].Value.AsDate().ToString("yyyy-MM-dd");
            }

            if (document.Fields.ContainsKey("Total"))
            {
                receiptData.TotalAmount = document.Fields["Total"].Value.AsDouble();
            }
            if (document.Fields.ContainsKey("Items"))
            {
                var items = document.Fields["Items"].Value.AsList();
                foreach (var item in items)
                {
                    var itemFields = item.Value.AsDictionary();
                    var itemName = itemFields.ContainsKey("Description") ? itemFields["Description"].Value.AsString() : string.Empty;
                    var itemPrice = itemFields.ContainsKey("TotalPrice") ? itemFields["TotalPrice"].Value.AsDouble() : 0;

                    receiptData.Items.Add(new ReceiptItem
                    {
                        Name = itemName,
                        Price = itemPrice
                    });
                }
            }
        }

        return receiptData;
    }
}

// Klasy pomocnicze
public class ReceiptData
{
    public string Date { get; set; }
    public string StoreName { get; set; }
    public List<ReceiptItem> Items { get; set; } = new List<ReceiptItem>();
    public double TotalAmount { get; set; }
}

public class ReceiptItem
{
    public string Name { get; set; }
    public double Price { get; set; }
}
