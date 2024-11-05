namespace SZGD.Server.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SZGD.Server.Data;
using SZGD.Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
    [Route("api/[controller]")]
    [ApiController]
    public class UprawnieniaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UprawnieniaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Uprawnienia
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Uprawnienia>>> GetUprawnienia()
        {
            return await _context.Uprawnienia.ToListAsync();
        }

        // GET: api/Uprawnienia/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Uprawnienia>> GetUprawnienie(int id)
        {
            var uprawnienie = await _context.Uprawnienia.FindAsync(id);

            if (uprawnienie == null)
            {
                return NotFound();
            }

            return uprawnienie;
        }

        // POST: api/Uprawnienia
        [HttpPost]
        public async Task<ActionResult<Uprawnienia>> PostUprawnienie(Uprawnienia uprawnienie)
        {
            _context.Uprawnienia.Add(uprawnienie);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUprawnienie), new { id = uprawnienie.Id }, uprawnienie);
        }

        // PUT: api/Uprawnienia/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUprawnienie(int id, Uprawnienia uprawnienie)
        {
            if (id != uprawnienie.Id)
            {
                return BadRequest();
            }

            _context.Entry(uprawnienie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UprawnienieExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Uprawnienia/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUprawnienie(int id)
        {
            var uprawnienie = await _context.Uprawnienia.FindAsync(id);
            if (uprawnienie == null)
            {
                return NotFound();
            }

            _context.Uprawnienia.Remove(uprawnienie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UprawnienieExists(int id)
        {
            return _context.Uprawnienia.Any(e => e.Id == id);
        }
    }