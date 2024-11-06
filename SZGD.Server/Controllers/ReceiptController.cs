using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using Azure;
using IronOcr;
namespace SZGD.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReceiptController : ControllerBase
{
    private readonly ReceiptProcessor _receiptProcessor;

    public ReceiptController()
    {
        _receiptProcessor = new ReceiptProcessor();  // Inicjalizacja klasy przetwarzającej obraz
    }

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> OnPostUploadAsync([FromForm] List<IFormFile> files)
    {
        if (files == null || !files.Any())
            return BadRequest("Brak plików do przesłania.");

        long totalSize = files.Sum(f => f.Length);
        var receiptDataList = new List<ReceiptData>();

        foreach (var formFile in files)
        {
            if (formFile.Length > 0)
            {
                // Zapisz plik tymczasowo
                var filePath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());

                using (var stream = System.IO.File.Create(filePath))
                {
                    await formFile.CopyToAsync(stream);
                }

                // Przetwarzaj plik i dodaj dane do listy wyników
                var fileContent = _receiptProcessor.ProcessReceiptImage(filePath);
                var receiptData = await _receiptProcessor.ProcessAI(fileContent);
                receiptDataList.Add(receiptData);

                // Usuń tymczasowy plik po przetworzeniu
                System.IO.File.Delete(filePath);
            }
        }

        return Ok(new { count = files.Count, totalSize, receipts = receiptDataList });
    }
    

}