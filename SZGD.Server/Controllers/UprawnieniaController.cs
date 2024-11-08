using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using SZGD.Server.Models;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UprawnieniaController : ControllerBase
    {
        private static List<Uprawnienia> _uprawnienia = new List<Uprawnienia>();

        // GET: api/Uprawnienia
        [HttpGet]
        public ActionResult<IEnumerable<Uprawnienia>> GetUprawnienia()
        {
            return Ok(_uprawnienia);
        }

        // GET: api/Uprawnienia/{id}
        [HttpGet("{id}")]
        public ActionResult<Uprawnienia> GetUprawnienia(int id)
        {
            var uprawnienie = _uprawnienia.FirstOrDefault(u => u.Id == id);
            if (uprawnienie == null)
            {
                return NotFound("Uprawnienia nie zostały znalezione.");
            }
            return Ok(uprawnienie);
        }

        // POST: api/Uprawnienia
        [HttpPost]
        public ActionResult<Uprawnienia> CreateUprawnienia([FromBody] Uprawnienia newUprawnienia)
        {
            // Ustawienie unikalnego ID dla nowych uprawnień
            newUprawnienia.Id = _uprawnienia.Any() ? _uprawnienia.Max(u => u.Id) + 1 : 1;
            _uprawnienia.Add(newUprawnienia);
            return CreatedAtAction(nameof(GetUprawnienia), new { id = newUprawnienia.Id }, newUprawnienia);
        }

        // PUT: api/Uprawnienia/{id}
        [HttpPut("{id}")]
        public ActionResult UpdateUprawnienia(int id, [FromBody] Uprawnienia updatedUprawnienia)
        {
            var uprawnienie = _uprawnienia.FirstOrDefault(u => u.Id == id);
            if (uprawnienie == null)
            {
                return NotFound("Uprawnienia nie zostały znalezione.");
            }

            // Aktualizacja właściwości uprawnień
            uprawnienie.CzyWidziInformacjeMedyczneDomownikow = updatedUprawnienia.CzyWidziInformacjeMedyczneDomownikow;
            uprawnienie.CzyWidziSprzet = updatedUprawnienia.CzyWidziSprzet;
            uprawnienie.CzyWidziDomownikow = updatedUprawnienia.CzyWidziDomownikow;
            uprawnienie.CzyMozeModyfikowacDomownikow = updatedUprawnienia.CzyMozeModyfikowacDomownikow;
            uprawnienie.CzyMozeModyfikowacGospodarstwo = updatedUprawnienia.CzyMozeModyfikowacGospodarstwo;
            uprawnienie.CzyMozePrzesylacPliki = updatedUprawnienia.CzyMozePrzesylacPliki;
            uprawnienie.Domownik = updatedUprawnienia.Domownik;

            return NoContent();
        }

        // DELETE: api/Uprawnienia/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteUprawnienia(int id)
        {
            var uprawnienie = _uprawnienia.FirstOrDefault(u => u.Id == id);
            if (uprawnienie == null)
            {
                return NotFound("Uprawnienia nie zostały znalezione.");
            }

            _uprawnienia.Remove(uprawnienie);
            return NoContent();
        }
    }
}
