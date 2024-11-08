using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using SZGD.Server.Models;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParagonController : ControllerBase
    {
        private static List<PrzeslanyPlik> _przeslanePliki = new List<PrzeslanyPlik>();

        // POST: api/File
        [HttpPost]
        public async Task<ActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                var fileContent = memoryStream.ToArray();

                var uploadedFile = new PrzeslanyPlik(file.FileName, fileContent);
                _przeslanePliki.Add(uploadedFile);
            }

            return Ok("File uploaded successfully.");
        }

        // GET: api/File
        [HttpGet]
        public ActionResult<List<PrzeslanyPlik>> GetUploadedFiles()
        {
            return Ok(_przeslanePliki);
        }
        [HttpDelete("deleteReceipt")]
        public IActionResult UsunParagon(string nazwapliku)
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

            _przeslanePliki.Remove(przeslanyPlik);

            return NoContent();
        }
    }
}