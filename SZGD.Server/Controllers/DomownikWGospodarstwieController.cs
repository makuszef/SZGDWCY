using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SZGD.Server.Models;
using SZGD.Server.Data; // Assuming your DbContext is in this namespace
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DomownikWGospodarstwieController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DomownikWGospodarstwieController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/DomownikWGospodarstwie
        [HttpPost]
        public async Task<ActionResult<DomownikWGospodarstwie>> CreateDomownikWGospodarstwie([FromBody] DomownikWGospodarstwie domownikWGospodarstwie)
        {
            if (domownikWGospodarstwie == null)
            {
                return BadRequest("DomownikWGospodarstwie cannot be null.");
            }

            // Validate properties here if necessary
            if (string.IsNullOrEmpty(domownikWGospodarstwie.DomownikId) || domownikWGospodarstwie.GospodarstwoId == 0)
            {
                return BadRequest("DomownikId and GospodarstwoId are required.");
            }

            _context.DomownikWGospodarstwie.Add(domownikWGospodarstwie);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDomownikWGospodarstwieById), new { id = domownikWGospodarstwie.GospodarstwoId }, domownikWGospodarstwie);
        }

        // GET: api/DomownikWGospodarstwie
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DomownikWGospodarstwie>>> GetAllDomownicyWGospodarstwie()
        {
            var domownicy = await _context.DomownikWGospodarstwie
                .Include(dw => dw.Domownik) // Include Domownik details
                .Include(dw => dw.Gospodarstwo) // Include Gospodarstwo details
                .ToListAsync();

            return Ok(domownicy);
        }

        // GET: api/DomownikWGospodarstwie/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DomownikWGospodarstwie>> GetDomownikWGospodarstwieById(int id)
        {
            var domownikWGospodarstwie = await _context.DomownikWGospodarstwie
                .Include(dw => dw.Domownik)
                .Include(dw => dw.Gospodarstwo)
                .FirstOrDefaultAsync(dw => dw.GospodarstwoId == id);

            if (domownikWGospodarstwie == null)
            {
                return NotFound();
            }

            return Ok(domownikWGospodarstwie);
        }

        // PUT: api/DomownikWGospodarstwie/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateDomownikWGospodarstwie(int id, [FromBody] DomownikWGospodarstwie updatedDomownikWGospodarstwie)
        {
            var domownikWGospodarstwie = await _context.DomownikWGospodarstwie.FindAsync(id);
            if (domownikWGospodarstwie == null)
            {
                return NotFound();
            }

            // Update the fields
            domownikWGospodarstwie.CzyWidziInformacjeMedyczneDomownikow = updatedDomownikWGospodarstwie.CzyWidziInformacjeMedyczneDomownikow;
            domownikWGospodarstwie.CzyWidziSprzet = updatedDomownikWGospodarstwie.CzyWidziSprzet;
            domownikWGospodarstwie.CzyWidziDomownikow = updatedDomownikWGospodarstwie.CzyWidziDomownikow;
            domownikWGospodarstwie.CzyMozeModyfikowacDomownikow = updatedDomownikWGospodarstwie.CzyMozeModyfikowacDomownikow;
            domownikWGospodarstwie.CzyMozeModyfikowacGospodarstwo = updatedDomownikWGospodarstwie.CzyMozeModyfikowacGospodarstwo;
            domownikWGospodarstwie.CzyMozePrzesylacPliki = updatedDomownikWGospodarstwie.CzyMozePrzesylacPliki;
            domownikWGospodarstwie.Rola = updatedDomownikWGospodarstwie.Rola;

            _context.DomownikWGospodarstwie.Update(domownikWGospodarstwie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/DomownikWGospodarstwie/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDomownikWGospodarstwie(int id)
        {
            var domownikWGospodarstwie = await _context.DomownikWGospodarstwie.FindAsync(id);
            if (domownikWGospodarstwie == null)
            {
                return NotFound();
            }

            _context.DomownikWGospodarstwie.Remove(domownikWGospodarstwie);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
