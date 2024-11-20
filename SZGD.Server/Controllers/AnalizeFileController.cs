using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using Azure;
using Microsoft.AspNetCore.Authorization;
using SZGD.Server.Data;
using SZGD.Server.Models;
using SZGD.Server.Sterowanie;

namespace SZGD.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AnalizeFileController : ControllerBase
    {
        private readonly ReceiptProcessor _receiptProcessor;
        private readonly ApplicationDbContext _context;
        private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB
        private static readonly List<string> AllowedImageTypes = new List<string> { "image/jpeg", "image/png", "image/gif" };
        private readonly VirusTotalScanner _virusTotalScanner;

        public AnalizeFileController(ApplicationDbContext context, IConfiguration configuration)
        {
            _receiptProcessor = new ReceiptProcessor();  // Initialize the image processing class
            _context = context;
            var apiKey = configuration["VirusTotal:ApiKey"];
            _virusTotalScanner = new VirusTotalScanner(apiKey);
        }

        // POST: api/AnalizeFile/upload
        [HttpPost("upload/{gospodarstwoId}")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> PrzeslijPlik(IFormFile file, int gospodarstwoId)
{
    if (file == null || file.Length == 0)
        return BadRequest("Nie przesłano pliku.");

    if (file.Length > MaxFileSize)
        return BadRequest("Rozmiar pliku przekracza limit 5 MB.");

    if (!AllowedImageTypes.Contains(file.ContentType))
        return BadRequest("Dozwolone są tylko pliki graficzne (JPEG, PNG, GIF).");
    var uploadedFile = new PrzeslanyPlik();
    using (var memoryStream = new MemoryStream())
    {
        await file.CopyToAsync(memoryStream);
        var fileContent = memoryStream.ToArray();

        var isMalicious = await _virusTotalScanner.ScanFileForMalware(fileContent);
        if (isMalicious)
            return BadRequest("Plik został zidentyfikowany jako złośliwy.");

        // Save the file to database
        uploadedFile.NazwaPliku = file.FileName;
        uploadedFile.ZawartoscPliku = fileContent;
        
    }

    var filePath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
    await using (var stream = System.IO.File.Create(filePath))
    {
        await file.CopyToAsync(stream);
    }

    Paragon receiptData;
    await using (var fileStream = new FileStream(filePath, FileMode.Open))
    {
        receiptData = await _receiptProcessor.ProcessAI(fileStream);
    }

    System.IO.File.Delete(filePath);

    // Add the parsed receipt data to Paragony and PozycjeParagonu tables
    var paragon = new Paragon
    {
        Date = receiptData.Date ?? DateTime.Now.ToString(),
        StoreName = receiptData.StoreName ?? "Nieznany sklep",
        TotalAmount = receiptData.TotalAmount ,
        GospodarstwoId = gospodarstwoId,
    };
    if (paragon.Date == null) paragon.Date = DateTime.Now.ToString();
    uploadedFile.Paragon = paragon;
    _context.Pliki.Add(uploadedFile);
    _context.Paragony.Add(paragon);
    await _context.SaveChangesAsync();

    // Add items to PozycjeParagonu associated with the paragon
    foreach (var item in receiptData.Items)
    {
        var pozycjaParagonu = new PozycjaParagonu
        {
            Paragon = paragon, // Associate the item directly with the Paragon object
            Name = item.Name,
            Price = item.Price,
            Quantity = item.Quantity
        };

        _context.PozycjeParagonu.Add(pozycjaParagonu);
    }

    await _context.SaveChangesAsync();

    return Ok(new { receipt = receiptData });
}


        // GET: api/AnalizeFile/AnalizujParagon
        [HttpGet("AnalizujParagon")]
        public async Task<IActionResult> AnalizujParagon(string nazwapliku, int idParagonu)
        {
            if (string.IsNullOrEmpty(nazwapliku))
                return BadRequest("Brak nazwy pliku.");

            var przeslanyPlik = _context.Pliki
                .FirstOrDefault(p => p.NazwaPliku == nazwapliku && p.ParagonId == idParagonu);

            if (przeslanyPlik == null)
                return NotFound("Plik nie został znaleziony.");

            var receiptDataList = new List<Paragon>();
            using (var memoryStream = new MemoryStream(przeslanyPlik.ZawartoscPliku))
            {
                var receiptData = await _receiptProcessor.ProcessAI(memoryStream);
                receiptDataList.Add(receiptData);
            }

            foreach (var receiptData in receiptDataList)
            {
                var paragon = new Paragon
                {
                    Id = idParagonu,
                    Date = receiptData.Date,
                    StoreName = receiptData.StoreName,
                    TotalAmount = receiptData.TotalAmount
                };

                _context.Paragony.Add(paragon);
                await _context.SaveChangesAsync();

                foreach (var item in receiptData.Items)
                {
                    var pozycjaParagonu = new PozycjaParagonu
                    {
                        ParagonId = paragon.Id,
                        Name = item.Name,
                        Price = item.Price,
                        Quantity = item.Quantity
                    };

                    _context.PozycjeParagonu.Add(pozycjaParagonu);
                }

                await _context.SaveChangesAsync();
            }

            return Ok(new { receipt = receiptDataList.FirstOrDefault() });
        }
    }
}
