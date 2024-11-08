using Microsoft.AspNetCore.Mvc;
using SZGD.Server.Models;
using System.Collections.Generic;
using System.Linq;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DomownikController : ControllerBase
    {
        // Lista przechowująca domowników w pamięci
        private static List<Domownik> _domownicy = new List<Domownik>();

        // GET: api/Domownik
        [HttpGet]
        public ActionResult<IEnumerable<Domownik>> GetDomownicy()
        {
            return Ok(_domownicy);
        }

        // GET: api/Domownik/{id}
        [HttpGet("{id}")]
        public ActionResult<Domownik> GetDomownik(string id)
        {
            var domownik = _domownicy.FirstOrDefault(d => d.Id == id);
            if (domownik == null)
            {
                return NotFound(new { message = "Domownik not found" });
            }
            return Ok(domownik);
        }

        // POST: api/Domownik
        [HttpPost]
        public ActionResult<Domownik> CreateDomownik([FromBody] Domownik newDomownik)
        {
            // Ustawienie unikalnego ID dla nowego domownika
            newDomownik.Id = (_domownicy.Count + 1).ToString();
            _domownicy.Add(newDomownik);
            return CreatedAtAction(nameof(GetDomownik), new { id = newDomownik.Id }, newDomownik);
        }

        // PUT: api/Domownik/{id}
        [HttpPut("{id}")]
        public ActionResult UpdateDomownik(string id, [FromBody] Domownik updateDomownik)
        {
            var domownik = _domownicy.FirstOrDefault(d => d.Id == id);
            if (domownik == null)
            {
                return NotFound(new { message = "Domownik not found" });
            }

            // Aktualizacja właściwości domownika
            domownik.Imie = updateDomownik.Imie;
            domownik.Nazwisko = updateDomownik.Nazwisko;
            domownik.Email = updateDomownik.Email;
            domownik.PhoneNumber = updateDomownik.PhoneNumber;
            domownik.UserName = updateDomownik.UserName;

            return Ok(new { message = "Domownik updated successfully" });
        }

        // DELETE: api/Domownik/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteDomownik(string id)
        {
            var domownik = _domownicy.FirstOrDefault(d => d.Id == id);
            if (domownik == null)
            {
                return NotFound(new { message = "Domownik not found" });
            }
            _domownicy.Remove(domownik);
            return NoContent();
        }
    }
}
