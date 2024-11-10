using SZGD.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using SZGD.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DomownikController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DomownikController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Domownik
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Domownik>>> GetDomownicy()
        {
            var domownicy = await _context.Domownicy
                .ToListAsync();
            return Ok(domownicy);
        }

        // GET: api/Domownik/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Domownik>> GetDomownik(string id)
        {
            var domownik = await _context.Domownicy
                .FirstOrDefaultAsync(d => d.Id == id);

            if (domownik == null)
            {
                return NotFound(new { message = "Domownik not found" });
            }

            return Ok(domownik);
        }

        // POST: api/Domownik
        [HttpPost]
        public async Task<ActionResult<Domownik>> CreateDomownik([FromBody] Domownik newDomownik)
        {
            // Check if email or username already exists
            if (await _context.Domownicy.AnyAsync(d => d.Email == newDomownik.Email || d.UserName == newDomownik.UserName))
            {
                return BadRequest(new { message = "Email or username already in use" });
            }

            _context.Domownicy.Add(newDomownik);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDomownik), new { id = newDomownik.Id }, newDomownik);
        }

        // PUT: api/Domownik/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateDomownik(string id, [FromBody] Domownik updateDomownik)
        {
            var domownik = await _context.Domownicy.FindAsync(id);
            if (domownik == null)
            {
                return NotFound(new { message = "Domownik not found" });
            }

            // Update properties
            domownik.Imie = updateDomownik.Imie;
            domownik.Nazwisko = updateDomownik.Nazwisko;
            domownik.Email = updateDomownik.Email;
            domownik.PhoneNumber = updateDomownik.PhoneNumber;
            domownik.UserName = updateDomownik.UserName;

            _context.Domownicy.Update(domownik);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Domownik updated successfully" });
        }

        // DELETE: api/Domownik/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDomownik(string id)
        {
            var domownik = await _context.Domownicy
                .Include(d => d.DomownikWGospodarstwie) // Include related entities
                .FirstOrDefaultAsync(d => d.Id == id);

            if (domownik == null)
            {
                return NotFound(new { message = "Domownik not found" });
            }

            // Remove related DomownikWGospodarstwie entries if necessary
            _context.Domownicy.Remove(domownik);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
