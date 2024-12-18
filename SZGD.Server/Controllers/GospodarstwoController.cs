using SZGD.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using SZGD.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace SZGD.Server.Controllers
{
    [Authorize]
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
        public async Task<ActionResult<Gospodarstwo>> Create(DodajGospodarstwoRequest gospodarstwo)
        {
            var noweGospodarstwo = new Gospodarstwo()
            {
                Id = gospodarstwo.id,
                nazwa = gospodarstwo.nazwa
            };
            _context.Gospodarstwa.Add(noweGospodarstwo);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = noweGospodarstwo.Id }, noweGospodarstwo);
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

        // GET: api/Gospodarstwo/{id}/Paragony
        [HttpGet("{id}/Paragony")]
        public async Task<ActionResult<IEnumerable<Paragon>>> GetParagonyByGospodarstwoId(int id)
        {
            // Pobierz paragony powiązane z gospodarstwem o określonym Id
            var paragony = await _context.Paragony
                .Include(p => p.Items) // Uwzględnij elementy paragonu
                .Where(p => p.GospodarstwoId == id) // Filtruj po GospodarstwoId
                .ToListAsync();

            if (paragony == null || !paragony.Any())
            {
                return NotFound("Nie znaleziono paragonów dla podanego gospodarstwa.");
            }

            return Ok(paragony);
        }
        
        // GET: api/Gospodarstwo/{id}/Sprzety
        [HttpGet("{id}/Sprzety")]
        public async Task<ActionResult<IEnumerable<Sprzet>>> GetSprzetyByGospodarstwoId(int id)
        {
            // Pobierz sprzęty powiązane z gospodarstwem o określonym Id
            var sprzety = await _context.Sprzet
                .Where(s => s.GospodarstwoId == id)  // Filtruj po GospodarstwoId
                .ToListAsync();

            if (sprzety == null || !sprzety.Any())
            {
                return NotFound("Nie znaleziono sprzętu dla podanego gospodarstwa.");
            }

            return Ok(sprzety);
        }

        // GET: api/Gospodarstwo/{id}/Pliki
        [HttpGet("{id}/Pliki")]
        public async Task<ActionResult<IEnumerable<PrzeslanyPlik>>> GetPlikiByParagonId(int id)
        {
            // Pobierz pliki powiązane z gospodarstwem o określonym Id
            var pliki = await _context.Pliki
                .Where(p => p.ParagonId == id)  // Filtruj po GospodarstwoId
                .ToListAsync();

            if (pliki == null || !pliki.Any())
            {
                return NotFound("Nie znaleziono plików dla podanego gospodarstwa.");
            }

            return Ok(pliki);
        }

    }
    
}
public class DodajGospodarstwoRequest
{
    public int id { get; set; }
    public string nazwa { get; set; }
}