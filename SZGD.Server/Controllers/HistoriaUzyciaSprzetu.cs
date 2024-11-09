using Microsoft.AspNetCore.Mvc;
using SZGD.Server.Models;
using System.Collections.Generic;
using System.Linq;

namespace SZGD.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoriaUzyciaSprzetuController : ControllerBase
    {
        private static List<HistoriaUzyciaSprzetu> _historiaList = new List<HistoriaUzyciaSprzetu>();

        [HttpPost]
        public ActionResult<HistoriaUzyciaSprzetu> CreateHistoria([FromBody] HistoriaUzyciaSprzetu historia)
        {
            if (historia.Sprzet == null || historia.Domownik == null || historia.DataUzycia == default || string.IsNullOrEmpty(historia.KomentarzDoAwarii))
            {
                return BadRequest("Wszystkie pola muszą być wypełnione i poprawne.");
            }

            _historiaList.Add(historia);
            return CreatedAtAction(nameof(GetHistoriaById), new { id = _historiaList.Count - 1 }, historia);
        }

        [HttpGet]
        public ActionResult<IEnumerable<HistoriaUzyciaSprzetu>> GetAllHistoria()
        {
            return Ok(_historiaList);
        }

        [HttpGet("{id}")]
        public ActionResult<HistoriaUzyciaSprzetu> GetHistoriaById(int id)
        {
            var historia = _historiaList.ElementAtOrDefault(id);
            if (historia == null)
            {
                return NotFound();
            }
            return Ok(historia);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateHistoria(int id, [FromBody] HistoriaUzyciaSprzetu updatedHistoria)
        {
            var historia = _historiaList.ElementAtOrDefault(id);
            if (historia == null)
            {
                return NotFound();
            }

            if (updatedHistoria.Sprzet == null || updatedHistoria.Domownik == null || updatedHistoria.DataUzycia == default || string.IsNullOrEmpty(updatedHistoria.KomentarzDoAwarii))
            {
                return BadRequest("Wszystkie pola muszą być wypełnione i poprawne.");
            }

            historia.Sprzet = updatedHistoria.Sprzet;
            historia.Domownik = updatedHistoria.Domownik;
            historia.DataUzycia = updatedHistoria.DataUzycia;
            historia.CzyWystapilaAwaria = updatedHistoria.CzyWystapilaAwaria;
            historia.KomentarzDoAwarii = updatedHistoria.KomentarzDoAwarii;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteHistoria(int id)
        {
            var historia = _historiaList.ElementAtOrDefault(id);
            if (historia == null)
            {
                return NotFound();
            }
            _historiaList.RemoveAt(id);
            return NoContent();
        }
    }
}
