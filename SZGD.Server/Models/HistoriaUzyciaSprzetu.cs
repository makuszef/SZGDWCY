using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;
namespace SZGD.Server.Models
{
    public class HistoriaUzyciaSprzetu
    {
        public int Id { get; set; }
        public int SprzetId { get; set; }
        [ForeignKey(nameof(Domownik))]
        public string DomownikId { get; set; }
        [ForeignKey(nameof(Gospodarstwo))]
        public int GospodarstwoId { get; set; }
        [JsonIgnore]
        public Sprzet Sprzet { get; set; }
        public DomownikWGospodarstwie DomownikWGospodarstwie { get; set; }
        public DateTime DataUzycia { get; set; }
        public bool CzyWystapilaAwaria { get; set; }
        public string KomentarzDoAwarii { get; set; }
    }
}