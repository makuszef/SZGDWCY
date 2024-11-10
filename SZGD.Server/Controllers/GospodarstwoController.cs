using SZGD.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SZGD.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace SZGD.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GospodarstwoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GospodarstwoController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Gospodarstwo
        [HttpGet]
        public async Task<ActionResult<List<Gospodarstwo>>> GetAll()
        {
            var gospodarstwa = await _context.Gospodarstwa
                .Include(g => g.Sprzet)
                .Include(g => g.Paragony)
                .ToListAsync();
            return Ok(gospodarstwa);
        }

        // GET: api/Gospodarstwo/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Gospodarstwo>> GetById(int id)
        {
            var gospodarstwo = await _context.Gospodarstwa
                .Include(g => g.Sprzet)
                .Include(g => g.Paragony)
                .Include(g => g.DomownikWGospodarstwie)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (gospodarstwo == null)
            {
                return NotFound();
            }
            foreach (var dw in gospodarstwo.DomownikWGospodarstwie)
            {
                dw.Domownik = await _context.Domownicy
                    .FirstOrDefaultAsync(d => d.Id == dw.DomownikId);
            }
            return Ok(gospodarstwo);
        }

        // POST: api/Gospodarstwo
        [HttpPost]
        public async Task<ActionResult<Gospodarstwo>> Create(Gospodarstwo gospodarstwo)
        {
            _context.Gospodarstwa.Add(gospodarstwo);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = gospodarstwo.Id }, gospodarstwo);
        }

        // PUT: api/Gospodarstwo/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, Gospodarstwo updatedGospodarstwo)
        {
            var gospodarstwo = await _context.Gospodarstwa.FindAsync(id);
            if (gospodarstwo == null)
            {
                return NotFound();
            }

            gospodarstwo.nazwa = updatedGospodarstwo.nazwa;
            _context.Gospodarstwa.Update(gospodarstwo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Gospodarstwo/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var gospodarstwo = await _context.Gospodarstwa.FindAsync(id);
            if (gospodarstwo == null)
            {
                return NotFound();
            }

            _context.Gospodarstwa.Remove(gospodarstwo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Gospodarstwo/{id}/Domownik
        [HttpPost("{id}/Domownik")]
        public async Task<ActionResult> AddDomownik(int id, [FromBody] Domownik newDomownik)
        {
            // Find the specified Gospodarstwo
            var gospodarstwo = await _context.Gospodarstwa
                .Include(g => g.DomownikWGospodarstwie)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (gospodarstwo == null)
            {
                return NotFound("Gospodarstwo o podanym ID nie istnieje.");
            }

            // Add the Domownik in the DomownikWGospodarstwie relationship
            var domownikWGospodarstwie = new DomownikWGospodarstwie
            {
                DomownikId = newDomownik.Id,
                GospodarstwoId = id
            };

            _context.Domownicy.Add(newDomownik); // Add Domownik to the Domownicy table
            _context.DomownikWGospodarstwie.Add(domownikWGospodarstwie); // Link in DomownikWGospodarstwie
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = gospodarstwo.Id }, newDomownik);
        }
    }
}
