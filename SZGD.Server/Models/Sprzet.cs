using System.Text.Json.Serialization;

namespace SZGD.Server.Models
{
    public class Sprzet
    {
        public int ID { get; set; }
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