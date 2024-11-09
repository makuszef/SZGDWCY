using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using SZGD.Server.Models;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SprzetController : ControllerBase
    {
        private static List<Sprzet> _sprzety = new List<Sprzet>();

        // GET: api/Sprzet
        [HttpGet]
        public ActionResult<IEnumerable<Sprzet>> GetSprzety()
        {
            return Ok(_sprzety);
        }

        // GET: api/Sprzet/{id}
        [HttpGet("{id}")]
        public ActionResult<Sprzet> GetSprzet(int id)
        {
            var sprzet = _sprzety.FirstOrDefault(s => s.Id == id);
            if (sprzet == null)
            {
                return NotFound("Sprzęt nie został znaleziony.");
            }
            return Ok(sprzet);
        }

        // POST: api/Sprzet
        [HttpPost]
        public ActionResult<Sprzet> CreateSprzet([FromBody] Sprzet newSprzet)
        {
            // Ustawienie unikalnego ID dla nowego sprzętu
            newSprzet.Id = _sprzety.Any() ? _sprzety.Max(s => s.Id) + 1 : 1;
            _sprzety.Add(newSprzet);
            return CreatedAtAction(nameof(GetSprzet), new { id = newSprzet.Id }, newSprzet);
        }

        // PUT: api/Sprzet/{id}
        [HttpPut("{id}")]
        public ActionResult UpdateSprzet(int id, [FromBody] Sprzet updatedSprzet)
        {
            var sprzet = _sprzety.FirstOrDefault(s => s.Id == id);
            if (sprzet == null)
            {
                return NotFound("Sprzęt nie został znaleziony.");
            }

            // Aktualizacja właściwości sprzętu
            sprzet.Nazwa = updatedSprzet.Nazwa;
            sprzet.Typ = updatedSprzet.Typ;
            sprzet.Status = updatedSprzet.Status;
            sprzet.Opis = updatedSprzet.Opis;

            return NoContent();
        }

        // DELETE: api/Sprzet/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteSprzet(int id)
        {
            var sprzet = _sprzety.FirstOrDefault(s => s.Id == id);
            if (sprzet == null)
            {
                return NotFound("Sprzęt nie został znaleziony.");
            }

            _sprzety.Remove(sprzet);
            return NoContent();
        }
    }
}
