using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SZGD.Server.Data;
using SZGD.Server.Models;

namespace SZGD.Server.Controllers;

[Route("api/[controller]")]
public class DomownikController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DomownikController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Domownicy
    [HttpGet]
    public ActionResult<IEnumerable<Domownik>> GetDomownicy()
    {
        try
        {
            var domownicy = _context.Domownicy.ToList();
            return Ok(domownicy); // Return 200 OK with the list of Domownicy
        }
        catch (DbUpdateException dbEx)
        {
            // Log the error details (dbEx) here if necessary
            return StatusCode(500, "Database operation failed. Please try again later.");
        }
        catch (Exception ex)
        {
            // Log the error details (ex) here if necessary
            return StatusCode(500, "An unexpected error occurred. Please try again later.");
        }
    }

    // GET: api/Domownicy/5
    [HttpGet("{id}")]
    public ActionResult<Domownik> GetDomownik(int id)
    {
        try
        {
            var domownik = _context.Domownicy.Find(id);

            if (domownik == null)
            {
                return NotFound(); // Return 404 Not Found if not found
            }

            return Ok(domownik); // Return 200 OK with the found Domownik
        }
        catch (DbUpdateException dbEx)
        {
            // Log the error details (dbEx) here if necessary
            return StatusCode(500, "Database operation failed. Please try again later.");
        }
        catch (Exception ex)
        {
            // Log the error details (ex) here if necessary
            Console.WriteLine(ex.Message);
            return StatusCode(500, "An unexpected error occurred. Please try again later." + ex.Message);
        }
    }
    [HttpGet("top5")]
    public async Task<ActionResult<IEnumerable<Domownik>>> GetTop5Domownicy()
    {
        try
        {
            var query = "SELECT TOP 5 Id, Imie FROM Domownicy ORDER BY Id";
            var top5Domownicy = await _context.Domownicy
                .FromSqlRaw(query)
                .Select(d => new DomownikDto
                {
                    Id = d.id_domownika,
                    Imie = d.Imie
                })
                .ToListAsync();

            return Ok(top5Domownicy);
        }
        catch (Exception ex)
        {
            // Log the exception (you can use a logging framework)
            // For now, just returning a bad request
            return BadRequest(new { message = ex.Message });
        }
    }
    // PUT: api/Domownik/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDomownik(int id, [FromBody] Domownik updateDto)
    {
        try
        {
            // Znajdź domownika po Id
            var domownik = await _context.Domownicy.FindAsync(id);
        
            if (domownik == null)
            {
                return NotFound(new { message = "Domownik not found" }); // Zwróć 404 jeśli nie znaleziono
            }

            // Zaktualizuj pola nazwy i e-maila
            domownik.Imie = updateDto.Imie;
            domownik.Email = updateDto.Email;
            // Zapisz zmiany w bazie danych
            await _context.SaveChangesAsync();

            return Ok(new { message = "Domownik updated successfully" }); // Zwróć 200 OK z potwierdzeniem
        }
        catch (DbUpdateException dbEx)
        {
            // Obsłuż błąd aktualizacji w bazie danych
            return StatusCode(500, "Database operation failed. Please try again later.");
        }
        catch (Exception ex)
        {
            // Obsłuż inne błędy
            Console.WriteLine(ex.Message);
            return StatusCode(500, "An unexpected error occurred. Please try again later." + ex.Message);
        }
    }
    public class DomownikDto
    {
        public int Id { get; set; }
        public string Imie { get; set; }
    }
}