using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SZGD.Server.Data;
using SZGD.Server.Models;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SprzetController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SprzetController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Sprzet
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sprzet>>> GetSprzety()
        {
            return await _context.Sprzet.ToListAsync();
        }

        // GET: api/Sprzet/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Sprzet>> GetSprzet(int id)
        {
            var sprzet = await _context.Sprzet.FindAsync(id);
            if (sprzet == null)
            {
                return NotFound("Sprzęt nie został znaleziony.");
            }
            return sprzet;
        }

        // POST: api/Sprzet
        [HttpPost]
        public async Task<ActionResult<Sprzet>> CreateSprzet([FromBody] Sprzet newSprzet)
        {
            _context.Sprzet.Add(newSprzet);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSprzet), new { id = newSprzet.Id }, newSprzet);
        }


        // PUT: api/Sprzet/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSprzet(int id, [FromBody] Sprzet updatedSprzet)
        {
            if (id != updatedSprzet.Id)
            {
                return BadRequest();
            }

            _context.Entry(updatedSprzet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SprzetExists(id))
                {
                    return NotFound("Sprzęt nie został znaleziony.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Sprzet/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSprzet(int id)
        {
            var sprzet = await _context.Sprzet.FindAsync(id);
            if (sprzet == null)
            {
                return NotFound("Sprzęt nie został znaleziony.");
            }

            _context.Sprzet.Remove(sprzet);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("GetAllSprzet/{gospodarstwoId}")]
        public async Task<ActionResult<IEnumerable<DomownikWGospodarstwie>>> GetAllGospodarstwaForDomownik(int gospodarstwoId)
        {
            var sprzet = await _context.Sprzet
                .Where(g => g.GospodarstwoId == gospodarstwoId)
                .ToListAsync();
            if (sprzet == null || sprzet.Count == 0)
            {
                return NotFound(new { message = "No gospodarstwa found for this domownik" });
            }

            return Ok(sprzet);
        }
        
        private bool SprzetExists(int id)
        {
            return _context.Sprzet.Any(e => e.Id == id);
        }
        
        // GET: api/Sprzet/{id}/Historia
        [HttpGet("{id}/Historia")]
        public async Task<ActionResult<IEnumerable<object>>> GetHistoriaBySprzetId(int id)
        {
            var historia = await _context.HistoriaUzyciaSprzetu
                .Where(h => h.SprzetId == id)
                .Include(h => h.DomownikWGospodarstwie)
                .Select(h => new
                {
                    h.Id,
                    ImieDomownika = h.DomownikWGospodarstwie.Domownik.Imie,
                    NazwiskoDomownika = h.DomownikWGospodarstwie.Domownik.Nazwisko,
                    h.DataUzycia,
                    h.CzyWystapilaAwaria,
                    h.KomentarzDoAwarii
                })
                .ToListAsync();

            if (historia == null || !historia.Any())
            {
                return NotFound("Nie znaleziono historii użycia dla podanego sprzętu.");
            }

            return Ok(historia);
        }


        
    }
}
