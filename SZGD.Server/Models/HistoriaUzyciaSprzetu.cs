using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SZGD.Server.Models
{
    public class HistoriaUzyciaSprzetu
    {
        public int Id { get; set; }
        public int SprzetId { get; set; }

        [ForeignKey(nameof(DomownikWGospodarstwie))]
        public string DomownikId { get; set; }

        public int GospodarstwoId { get; set; }

        [JsonIgnore]
        public Sprzet? Sprzet { get; set; }

        [JsonIgnore]
        public DomownikWGospodarstwie? DomownikWGospodarstwie { get; set; }

        public DateTime DataUzycia { get; set; }
        public bool CzyWystapilaAwaria { get; set; }
        public string KomentarzDoAwarii { get; set; }
    }
}