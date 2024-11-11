using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SZGD.Server.Models
{
    public class Sprzet
    {
        public int Id { get; set; }

        // Klucz obcy do Gospodarstwo
        public int GospodarstwoId { get; set; }

        // Właściwość nawigacyjna do Gospodarstwo
        [ForeignKey(nameof(GospodarstwoId))]
        [JsonIgnore]
        public Gospodarstwo? Gospodarstwo { get; set; }

        // Właściwość nawigacyjna do Historii Użycia Sprzętu
        [JsonIgnore]
        public List<HistoriaUzyciaSprzetu>? HistoriaUzyciaSprzetu { get; set; }

        public string Nazwa { get; set; }
        public string Typ { get; set; }
        public StatusSprzetu Status { get; set; }
        public string Opis { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum StatusSprzetu
    {
        Dostepny,
        Zajety,
        WNaprawie,
        Wycofany
    }
}