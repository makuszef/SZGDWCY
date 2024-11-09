using System.Text.Json.Serialization;

namespace SZGD.Server.Models
{
    public class HistoriaUzyciaSprzetu
    {
        public int Id { get; set; }
        public int SprzetId { get; set; }
        public int DomownikId { get; set; }
        [JsonIgnore]
        public Sprzet Sprzet { get; set; }
        [JsonIgnore]
        public Domownik Domownik { get; set; }
        public DateTime DataUzycia { get; set; }
        public bool CzyWystapilaAwaria { get; set; }
        public string KomentarzDoAwarii { get; set; }
    }
}