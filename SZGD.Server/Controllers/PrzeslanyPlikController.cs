using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using SZGD.Server.Models;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using SZGD.Server.Sterowanie;
using SZGD.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrzeslanyPlikController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB
        private static readonly List<string> AllowedImageTypes = new List<string> { "image/jpeg", "image/png", "image/gif" };
        private readonly VirusTotalScanner _virusTotalScanner;

        public PrzeslanyPlikController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            var apiKey = configuration["VirusTotal:ApiKey"];
            _virusTotalScanner = new VirusTotalScanner(apiKey);
        }

        // POST: api/PrzeslanyPlik
        [HttpPost]
        public async Task<ActionResult> UploadFile(IFormFile file)
        {
            // Walidacja obecności pliku
            if (file == null || file.Length == 0)
            {
                return BadRequest("Nie przesłano pliku.");
            }

            // Walidacja rozmiaru pliku
            if (file.Length > MaxFileSize)
            {
                return BadRequest("Rozmiar pliku przekracza limit 5 MB.");
            }

            // Walidacja typu MIME pliku
            if (!AllowedImageTypes.Contains(file.ContentType))
            {
                return BadRequest("Dozwolone są tylko pliki graficzne (JPEG, PNG, GIF).");
            }

            // Przekonwertuj plik do tablicy bajtów
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                var fileContent = memoryStream.ToArray();

                // Analiza pliku za pomocą VirusTotal
                var isMalicious = await _virusTotalScanner.ScanFileForMalware(fileContent);
                if (isMalicious)
                {
                    return BadRequest("Plik został zidentyfikowany jako złośliwy.");
                }

                // Tworzenie nowego obiektu pliku i dodawanie go do bazy danych
                var uploadedFile = new PrzeslanyPlik(file.FileName, fileContent);
                _context.Pliki.Add(uploadedFile);
                await _context.SaveChangesAsync();
            }

            return Ok("Plik został pomyślnie przesłany.");
        }

        // GET: api/PrzeslanyPlik
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrzeslanyPlik>>> GetAllPrzeslanyPlik()
        {
            var pliki = await _context.Pliki.ToListAsync();
            return Ok(pliki);
        }

        // GET: api/PrzeslanyPlik/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PrzeslanyPlik>> GetPrzeslanyPlikById(int id)
        {
            var plik = await _context.Pliki.FindAsync(id);
            if (plik == null)
            {
                return NotFound("Plik nie został znaleziony.");
            }
            return Ok(plik);
        }

        // DELETE: api/PrzeslanyPlik/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePrzeslanyPlik(int id)
        {
            var plik = await _context.Pliki.FindAsync(id);
            if (plik == null)
            {
                return NotFound("Plik nie został znaleziony.");
            }

            _context.Pliki.Remove(plik);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
