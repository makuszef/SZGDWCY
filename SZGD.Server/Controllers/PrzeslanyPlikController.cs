using Microsoft.AspNetCore.Mvc;
using SZGD.Server.Models;
using System.Collections.Generic;
using System.Linq;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrzeslanyPlikController : ControllerBase
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

        [HttpGet]
        public ActionResult<IEnumerable<PrzeslanyPlik>> GetAllPrzeslanyPlik()
        {
            return Ok(_przeslanePliki);
        }

        [HttpGet("{id}")]
        public ActionResult<PrzeslanyPlik> GetPrzeslanyPlikById(int id)
        {
            var plik = _przeslanePliki.ElementAtOrDefault(id);
            if (plik == null)
            {
                return NotFound();
            }
            return Ok(plik);
        }
        [HttpDelete("{id}")]
        public ActionResult DeletePrzeslanyPlik(int id)
        {
            var plik = _przeslanePliki.ElementAtOrDefault(id);
            if (plik == null)
            {
                return NotFound();
            }
            _przeslanePliki.RemoveAt(id);
            return NoContent();
        }
    }
}
