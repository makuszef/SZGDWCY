using System.Text.Json.Serialization;

namespace SZGD.Server.Models
{
    public class Sprzet
    {
        public int Id { get; set; }
        public int GospodarstwoId { get; set; }
        [JsonIgnore]
        public Gospodarstwo? Gospodarstwo { get; set; }
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