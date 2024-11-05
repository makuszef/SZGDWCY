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
        public ActionResult<Domownik> GetDomownik(int id)
        {
            var domownik = _domownicy.FirstOrDefault(d => d.id_domownika == id);
            if (domownik == null)
            {
                return NotFound(new ErrorResponse { Message = "Domownik not found" });
            }
            return Ok(domownik);
        }

        // POST: api/Domownik
        [HttpPost]
        public ActionResult<Domownik> CreateDomownik([FromBody] Domownik newDomownik)
        {
            // Ustawienie unikalnego ID dla nowego domownika
            newDomownik.id_domownika = _domownicy.Any() ? _domownicy.Max(d => d.id_domownika) + 1 : 1;
            _domownicy.Add(newDomownik);
            return CreatedAtAction(nameof(GetDomownik), new { id = newDomownik.id_domownika }, newDomownik);
        }

        // PUT: api/Domownik/{id}
        [HttpPut("{id}")]
        public ActionResult UpdateDomownik(int id, [FromBody] Domownik updateDomownik)
        {
            var domownik = _domownicy.FirstOrDefault(d => d.id_domownika == id);
            if (domownik == null)
            {
                return NotFound(new ErrorResponse { Message = "Domownik not found" });
            }

            // Aktualizacja właściwości domownika
            domownik.Imie = updateDomownik.Imie;
            domownik.Nazwisko = updateDomownik.Nazwisko;
            domownik.Email = updateDomownik.Email;
            domownik.Telefon = updateDomownik.Telefon;
            domownik.Nazwa_uzytkownika = updateDomownik.Nazwa_uzytkownika;

            return Ok(new SuccessResponse { Message = "Domownik updated successfully" });
        }

        // DELETE: api/Domownik/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteDomownik(int id)
        {
            var domownik = _domownicy.FirstOrDefault(d => d.id_domownika == id);
            if (domownik == null)
            {
                return NotFound(new { message = "Domownik not found" });
            }
            _domownicy.Remove(domownik);
            return NoContent();
        }
    }
}
