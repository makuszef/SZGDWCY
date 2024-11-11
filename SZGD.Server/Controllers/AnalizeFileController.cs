using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using Azure;
using IronOcr;
using SZGD.Server.Data;
using SZGD.Server.Models;
using SZGD.Server.Sterowanie;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalizeFileController : ControllerBase
    {
        private readonly ReceiptProcessor _receiptProcessor;
        private static List<PrzeslanyPlik> _przeslanePliki = new List<PrzeslanyPlik>();
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
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PrzeslijPlik(IFormFile file, int idGospodarstwa)
        {
            // Validate the presence of the file
            if (file == null || file.Length == 0)
            {
                return BadRequest("Nie przesłano pliku.");
            }

            // Validate file size
            if (file.Length > MaxFileSize)
            {
                return BadRequest("Rozmiar pliku przekracza limit 5 MB.");
            }

            // Validate MIME type
            if (!AllowedImageTypes.Contains(file.ContentType))
            {
                return BadRequest("Dozwolone są tylko pliki graficzne (JPEG, PNG, GIF).");
            }

            // Convert the file to a byte array
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                var fileContent = memoryStream.ToArray();

                // Scan file for malware using VirusTotal
                var isMalicious = await _virusTotalScanner.ScanFileForMalware(fileContent);
                if (isMalicious)
                {
                    return BadRequest("Plik został zidentyfikowany jako złośliwy.");
                }

                // Save the file to the database, now linked to Gospodarstwo
                var uploadedFile = new PrzeslanyPlik(file.FileName, fileContent)
                {
                    GospodarstwoId = idGospodarstwa // Link the file to the specific Gospodarstwo
                };
                _context.Pliki.Add(uploadedFile);
                await _context.SaveChangesAsync();
            }

            // Process the uploaded file
            var filePath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            var receiptDataList = new List<Paragon>();

            // Process the file and extract receipt data
            using (var fileStream = new FileStream(filePath, FileMode.Open))
            {
                var receiptData = await _receiptProcessor.ProcessAI(fileStream);
                receiptDataList.Add(receiptData);
            }

            // Delete the temporary file after processing
            System.IO.File.Delete(filePath);

            // Save Paragon and PozycjaParagonu to the database
            foreach (var receiptData in receiptDataList)
            {
                var paragon = new Paragon
                {
                    GospodarstwoId = idGospodarstwa,  // Link to the specific Gospodarstwo
                    Date = receiptData.Date,
                    StoreName = receiptData.StoreName,
                    TotalAmount = receiptData.TotalAmount
                };

                // Add the Paragon to the database
                _context.Paragony.Add(paragon);
                await _context.SaveChangesAsync(); // Save Paragon before saving items

                // Save each PozycjaParagonu (receipt item) to the database
                foreach (var item in receiptData.Items)
                {
                    var pozycjaParagonu = new PozycjaParagonu
                    {
                        ParagonId = paragon.Id,  // Link the item to the correct Paragon
                        Name = item.Name,
                        Price = item.Price,
                        Quantity = item.Quantity
                    };

                    _context.PozycjeParagonu.Add(pozycjaParagonu);
                }

                await _context.SaveChangesAsync(); // Save items after saving the Paragon
            }

            return Ok(new { receipt = receiptDataList.FirstOrDefault() });
        }

        // GET: api/AnalizeFile/AnalizujParagon
        [HttpGet("AnalizujParagon")]
        public async Task<IActionResult> AnalizujParagon(string nazwapliku, int idGospodarstwa)
        {
            // Validate the file name
            if (string.IsNullOrEmpty(nazwapliku))
            {
                return BadRequest("Brak nazwy pliku.");
            }

            // Retrieve the uploaded file by its name and GospodarstwoId
            var przeslanyPlik = _context.Pliki
                .FirstOrDefault(p => p.NazwaPliku == nazwapliku && p.GospodarstwoId == idGospodarstwa);

            if (przeslanyPlik == null)
            {
                return NotFound("Plik nie został znaleziony.");
            }

            // Process the file and extract receipt data
            var receiptDataList = new List<Paragon>();
            using (var memoryStream = new MemoryStream(przeslanyPlik.ZawartoscPliku))
            {
                var receiptData = await _receiptProcessor.ProcessAI(memoryStream);
                receiptDataList.Add(receiptData);
            }

            // Save Paragon and PozycjaParagonu to the database
            foreach (var receiptData in receiptDataList)
            {
                var paragon = new Paragon
                {
                    GospodarstwoId = idGospodarstwa,  // Link to the specific Gospodarstwo
                    Date = receiptData.Date,
                    StoreName = receiptData.StoreName,
                    TotalAmount = receiptData.TotalAmount
                };

                // Add the Paragon to the database
                _context.Paragony.Add(paragon);
                await _context.SaveChangesAsync(); // Save Paragon before saving items

                // Save each PozycjaParagonu (receipt item) to the database
                foreach (var item in receiptData.Items)
                {
                    var pozycjaParagonu = new PozycjaParagonu
                    {
                        ParagonId = paragon.Id,  // Link the item to the correct Paragon
                        Name = item.Name,
                        Price = item.Price,
                        Quantity = item.Quantity
                    };

                    _context.PozycjeParagonu.Add(pozycjaParagonu);
                }

                await _context.SaveChangesAsync(); // Save items after saving the Paragon
            }

            return Ok(new { receipt = receiptDataList.FirstOrDefault() });
        }
    }
}
