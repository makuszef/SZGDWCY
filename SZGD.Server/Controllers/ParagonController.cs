using Microsoft.AspNetCore.Mvc;
using SZGD.Server.Models;
using SZGD.Server.Data; // Assuming your DbContext is in this namespace
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParagonController : ControllerBase
    {
        private readonly ApplicationDbContext _context; // DbContext for interacting with the database

        public ParagonController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Paragon
        [HttpPost]
        public async Task<ActionResult<Paragon>> CreateParagon([FromBody] Paragon paragon)
        {
            if (string.IsNullOrEmpty(paragon.Date) || string.IsNullOrEmpty(paragon.StoreName) ||
                paragon.Items == null || paragon.Items.Count == 0 || paragon.TotalAmount <= 0)
            {
                return BadRequest("Wszystkie pola muszą być wypełnione i poprawne.");
            }

            // Add the new paragon to the database
            _context.Paragony.Add(paragon);
            await _context.SaveChangesAsync();

            // Return the created paragon with a location header pointing to the new resource
            return CreatedAtAction(nameof(GetParagonById), new { id = paragon.Id }, paragon);
        }

        // GET: api/Paragon
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Paragon>>> GetAllParagon()
        {
            // Retrieve all paragons from the database
            var paragony = await _context.Paragony
                .Include(p => p.Items) // Include items in the response if needed
                .ToListAsync();

            return Ok(paragony);
        }

        // GET: api/Paragon/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Paragon>> GetParagonById(int id)
        {
            // Retrieve a specific paragon from the database by its ID
            var paragon = await _context.Paragony
                .Include(p => p.Items) // Include items if necessary
                .FirstOrDefaultAsync(p => p.Id == id);

            if (paragon == null)
            {
                return NotFound();
            }

            return Ok(paragon);
        }

        // PUT: api/Paragon/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateParagon(int id, [FromBody] Paragon updatedParagon)
        {
            // Check if the paragon exists
            var paragon = await _context.Paragony.FindAsync(id);
            if (paragon == null)
            {
                return NotFound();
            }

            // Validate the data
            if (string.IsNullOrEmpty(updatedParagon.Date) || string.IsNullOrEmpty(updatedParagon.StoreName) ||
                updatedParagon.Items == null || updatedParagon.Items.Count == 0 || updatedParagon.TotalAmount <= 0)
            {
                return BadRequest("Wszystkie pola muszą być wypełnione i poprawne.");
            }

            // Update the properties
            paragon.Date = updatedParagon.Date;
            paragon.StoreName = updatedParagon.StoreName;
            paragon.Items = updatedParagon.Items; // Update items if needed
            paragon.TotalAmount = updatedParagon.TotalAmount;

            _context.Paragony.Update(paragon);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Paragon/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteParagon(int id)
        {
            // Find the paragon in the database
            var paragon = await _context.Paragony.FindAsync(id);
            if (paragon == null)
            {
                return NotFound();
            }

            // Remove the paragon from the database
            _context.Paragony.Remove(paragon);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
