using SZGD.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DomownikController : ControllerBase
    {
        private readonly UserManager<Domownik> _userManager;

        public DomownikController(UserManager<Domownik> userManager)
        {
            _userManager = userManager;
        }

        // GET: api/Domownik
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Domownik>>> GetDomownicy()
        {
            var domownicy = _userManager.Users.ToList();
            return Ok(domownicy);
        }

        // GET: api/Domownik/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Domownik>> GetDomownik(string id)
        {
            var domownik = await _userManager.FindByIdAsync(id);
            if (domownik == null)
            {
                return NotFound(new { message = "Domownik not found" });
            }
            return Ok(domownik);
        }

        // POST: api/Domownik
        [HttpPost]
        public async Task<ActionResult<Domownik>> CreateDomownik([FromBody] Domownik newDomownik, string password)
        {
            var result = await _userManager.CreateAsync(newDomownik, password);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetDomownik), new { id = newDomownik.Id }, newDomownik);
            }
            return BadRequest(result.Errors);
        }

        // PUT: api/Domownik/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateDomownik(string id, [FromBody] Domownik updateDomownik)
        {
            var domownik = await _userManager.FindByIdAsync(id);
            if (domownik == null)
            {
                return NotFound(new { message = "Domownik not found" });
            }

            domownik.Imie = updateDomownik.Imie;
            domownik.Nazwisko = updateDomownik.Nazwisko;
            domownik.Email = updateDomownik.Email;
            domownik.PhoneNumber = updateDomownik.PhoneNumber;
            domownik.UserName = updateDomownik.UserName;

            var result = await _userManager.UpdateAsync(domownik);
            if (result.Succeeded)
            {
                return Ok(new { message = "Domownik updated successfully" });
            }
            return BadRequest(result.Errors);
        }

        // DELETE: api/Domownik/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDomownik(string id)
        {
            var domownik = await _userManager.FindByIdAsync(id);
            if (domownik == null)
            {
                return NotFound(new { message = "Domownik not found" });
            }

            var result = await _userManager.DeleteAsync(domownik);
            if (result.Succeeded)
            {
                return NoContent();
            }
            return BadRequest(result.Errors);
        }
    }
}
