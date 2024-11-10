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
    public class PozycjaParagonuController : ControllerBase
    {
        private readonly ApplicationDbContext _context; // DbContext for interacting with the database

        public PozycjaParagonuController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/PozycjaParagonu
        [HttpPost]
        public async Task<ActionResult<PozycjaParagonu>> CreatePozycjaParagonu([FromBody] PozycjaParagonu pozycjaParagonu)
        {
            if (string.IsNullOrEmpty(pozycjaParagonu.Name) || pozycjaParagonu.Price <= 0 || pozycjaParagonu.Quantity <= 0)
            {
                return BadRequest("Wszystkie pola muszą być wypełnione i poprawne.");
            }

            // Add the new pozycja to the database
            _context.PozycjeParagonu.Add(pozycjaParagonu);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPozycjaParagonuById), new { id = pozycjaParagonu.Id }, pozycjaParagonu);
        }

        // GET: api/PozycjaParagonu
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PozycjaParagonu>>> GetAllPozycjaParagonu()
        {
            // Retrieve all pozycje from the database
            var pozycje = await _context.PozycjeParagonu.ToListAsync();
            return Ok(pozycje);
        }

        // GET: api/PozycjaParagonu/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PozycjaParagonu>> GetPozycjaParagonuById(int id)
        {
            // Retrieve a specific pozycja from the database by its ID
            var pozycjaParagonu = await _context.PozycjeParagonu.FindAsync(id);

            if (pozycjaParagonu == null)
            {
                return NotFound();
            }

            return Ok(pozycjaParagonu);
        }

        // PUT: api/PozycjaParagonu/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePozycjaParagonu(int id, [FromBody] PozycjaParagonu updatedPozycjaParagonu)
        {
            // Check if the pozycja exists
            var pozycjaParagonu = await _context.PozycjeParagonu.FindAsync(id);
            if (pozycjaParagonu == null)
            {
                return NotFound();
            }

            // Validate the updated data
            if (string.IsNullOrEmpty(updatedPozycjaParagonu.Name) || updatedPozycjaParagonu.Price <= 0 || updatedPozycjaParagonu.Quantity <= 0)
            {
                return BadRequest("Wszystkie pola muszą być wypełnione i poprawne.");
            }

            // Update the properties
            pozycjaParagonu.Name = updatedPozycjaParagonu.Name;
            pozycjaParagonu.Price = updatedPozycjaParagonu.Price;
            pozycjaParagonu.Quantity = updatedPozycjaParagonu.Quantity;

            _context.PozycjeParagonu.Update(pozycjaParagonu);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/PozycjaParagonu/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePozycjaParagonu(int id)
        {
            // Find the pozycja in the database
            var pozycjaParagonu = await _context.PozycjeParagonu.FindAsync(id);
            if (pozycjaParagonu == null)
            {
                return NotFound();
            }

            // Remove the pozycja from the database
            _context.PozycjeParagonu.Remove(pozycjaParagonu);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
