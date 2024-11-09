using Microsoft.AspNetCore.Mvc;
using SZGD.Server.Models;
using System.Collections.Generic;
using System.Linq;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParagonController : ControllerBase
    {
        private static List<Paragon> _paragonList = new List<Paragon>();

        [HttpPost]
        public ActionResult<Paragon> CreateParagon([FromBody] Paragon paragon)
        {
            if (string.IsNullOrEmpty(paragon.Date) || string.IsNullOrEmpty(paragon.StoreName) || paragon.Items == null || paragon.Items.Count == 0 || paragon.TotalAmount <= 0)
            {
                return BadRequest("Wszystkie pola muszą być wypełnione i poprawne.");
            }

            _paragonList.Add(paragon);
            return CreatedAtAction(nameof(GetParagonById), new { id = _paragonList.Count - 1 }, paragon);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Paragon>> GetAllParagon()
        {
            return Ok(_paragonList);
        }

        [HttpGet("{id}")]
        public ActionResult<Paragon> GetParagonById(int id)
        {
            var paragon = _paragonList.ElementAtOrDefault(id);
            if (paragon == null)
            {
                return NotFound();
            }
            return Ok(paragon);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateParagon(int id, [FromBody] Paragon updatedParagon)
        {
            var paragon = _paragonList.ElementAtOrDefault(id);
            if (paragon == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(updatedParagon.Date) || string.IsNullOrEmpty(updatedParagon.StoreName) || updatedParagon.Items == null || updatedParagon.Items.Count == 0 || updatedParagon.TotalAmount <= 0)
            {
                return BadRequest("Wszystkie pola muszą być wypełnione i poprawne.");
            }

            paragon.Date = updatedParagon.Date;
            paragon.StoreName = updatedParagon.StoreName;
            paragon.Items = updatedParagon.Items;
            paragon.TotalAmount = updatedParagon.TotalAmount;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteParagon(int id)
        {
            var paragon = _paragonList.ElementAtOrDefault(id);
            if (paragon == null)
            {
                return NotFound();
            }
            _paragonList.RemoveAt(id);
            return NoContent();
        }
    }
}
