using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using SZGD.Server.Data;
using SZGD.Server.Models;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoriaUzyciaSprzetuController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HistoriaUzyciaSprzetuController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/HistoriaUzyciaSprzetu
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistoriaUzyciaSprzetu>>> GetHistorie()
        {
            return await _context.HistoriaUzyciaSprzetu.ToListAsync();
        }

        // GET: api/HistoriaUzyciaSprzetu/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<HistoriaUzyciaSprzetu>> GetHistoria(int id)
        {
            var historia = await _context.HistoriaUzyciaSprzetu.FindAsync(id);
            if (historia == null)
            {
                return NotFound("Historia użycia sprzętu nie została znaleziona.");
            }
            return historia;
        }

        // POST: api/HistoriaUzyciaSprzetu
        [HttpPost]
        public async Task<ActionResult<HistoriaUzyciaSprzetu>> CreateHistoria([FromBody] HistoriaUzyciaSprzetu newHistoria)
        {
            // Opcjonalnie: sprawdź, czy powiązane obiekty istnieją
            var sprzetExists = await _context.Sprzet.AnyAsync(s => s.Id == newHistoria.SprzetId);
            if (!sprzetExists)
            {
                return BadRequest($"Sprzęt o ID {newHistoria.SprzetId} nie istnieje.");
            }

            var gospodarstwoExists = await _context.Gospodarstwa.AnyAsync(g => g.Id == newHistoria.GospodarstwoId);
            if (!gospodarstwoExists)
            {
                return BadRequest($"Gospodarstwo o ID {newHistoria.GospodarstwoId} nie istnieje.");
            }

            // Dodaj nową historię użycia sprzętu
            _context.HistoriaUzyciaSprzetu.Add(newHistoria);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHistoria), new { id = newHistoria.Id }, newHistoria);
        }

        // PUT: api/HistoriaUzyciaSprzetu/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHistoria(int id, [FromBody] HistoriaUzyciaSprzetu updatedHistoria)
        {
            if (id != updatedHistoria.Id)
            {
                return BadRequest();
            }

            _context.Entry(updatedHistoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HistoriaExists(id))
                {
                    return NotFound("Historia użycia sprzętu nie została znaleziona.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/HistoriaUzyciaSprzetu/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHistoria(int id)
        {
            var historia = await _context.HistoriaUzyciaSprzetu.FindAsync(id);
            if (historia == null)
            {
                return NotFound("Historia użycia sprzętu nie została znaleziona.");
            }

            _context.HistoriaUzyciaSprzetu.Remove(historia);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HistoriaExists(int id)
        {
            return _context.HistoriaUzyciaSprzetu.Any(e => e.Id == id);
        }
    }
}
