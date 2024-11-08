using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using Azure;
using IronOcr;
using SZGD.Server.Models;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalizeFileController : ControllerBase
    {
        private readonly ReceiptProcessor _receiptProcessor;
        private static List<PrzeslanyPlik> _przeslanePliki = new List<PrzeslanyPlik>();
        public AnalizeFileController()
        {
            _receiptProcessor = new ReceiptProcessor();  // Inicjalizacja klasy przetwarzającej obraz
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PrzeslijPlik(IFormFile plik)
        {
            if (plik == null || plik.Length == 0)
            {
                return BadRequest("Brak pliku do przesłania.");
            }

            var filePath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());

            using (var stream = System.IO.File.Create(filePath))
            {
                await plik.CopyToAsync(stream);
            }

            var receiptDataList = new List<Paragon>();

            // Przetwarzaj plik i dodaj dane do listy wyników
            using (var fileStream = new FileStream(filePath, FileMode.Open))
            {
                var receiptData = await _receiptProcessor.ProcessAI(fileStream);
                receiptDataList.Add(receiptData);
            }

            // Usuń tymczasowy plik po przetworzeniu
            System.IO.File.Delete(filePath);

            return Ok(new { receipt = receiptDataList.FirstOrDefault() });
        }
        [HttpGet()]
        public async Task<IActionResult> AnalizujParagon(string nazwapliku)
        {
            if (string.IsNullOrEmpty(nazwapliku))
            {
                return BadRequest("Brak nazwy pliku.");
            }

            var przeslanyPlik = _przeslanePliki.FirstOrDefault(p => p.NazwaPliku == nazwapliku);
            if (przeslanyPlik == null)
            {
                return NotFound("Plik nie został znaleziony.");
            }

            var receiptDataList = new List<Paragon>();

            // Przetwarzaj plik i dodaj dane do listy wyników
            using (var memoryStream = new MemoryStream(przeslanyPlik.ZawartoscPliku))
            {
                var receiptData = await _receiptProcessor.ProcessAI(memoryStream);
                receiptDataList.Add(receiptData);
            }

            return Ok(new { receipt = receiptDataList.FirstOrDefault() });
        }

    }
}