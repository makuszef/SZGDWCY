using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using SZGD.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using SZGD.Server.Sterowanie;
using SZGD.Server.Data;
using Microsoft.EntityFrameworkCore;
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

        public PrzeslanyPlikController(ApplicationDbContext context)
        {
            _context = context;
            _virusTotalScanner = new VirusTotalScanner("d3d6ce1a3ae4b80c146739d5747d831031733f75caa9dc6bcd73d7fdcc9cf887");
        }

        // POST: api/PrzeslanyPlik
        [HttpPost]
        public async Task<ActionResult> UploadFile(IFormFile file)
        {
            // Walidacja obecności pliku
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Walidacja rozmiaru pliku
            if (file.Length > MaxFileSize)
            {
                return BadRequest("File size exceeds the 5 MB limit.");
            }

            // Walidacja typu MIME pliku
            if (!AllowedImageTypes.Contains(file.ContentType))
            {
                return BadRequest("Only image files are allowed (JPEG, PNG, GIF).");
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
                    return BadRequest("File is identified as malicious.");
                }

                // Tworzenie nowego obiektu pliku i dodawanie go do bazy danych
                var uploadedFile = new PrzeslanyPlik(file.FileName, fileContent);
                _context.Pliki.Add(uploadedFile);
                await _context.SaveChangesAsync();
            }

            return Ok("File uploaded successfully.");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrzeslanyPlik>>> GetAllPrzeslanyPlik()
        {
            var pliki = await _context.Pliki.ToListAsync();
            return Ok(pliki);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PrzeslanyPlik>> GetPrzeslanyPlikById(int id)
        {
            var plik = await _context.Pliki.FindAsync(id);
            if (plik == null)
            {
                return NotFound();
            }
            return Ok(plik);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePrzeslanyPlik(int id)
        {
            var plik = await _context.Pliki.FindAsync(id);
            if (plik == null)
            {
                return NotFound();
            }

            _context.Pliki.Remove(plik);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
