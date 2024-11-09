using System.Text.Json.Serialization;

namespace SZGD.Server.Models
{
    public class Paragon
    {
        // Właściwości klasy Dokument
        public int Id {get;set;}
        public int GospodarstwoId {get;set;}
        public string Date { get; set; }
        public string StoreName { get; set; }
        public List<PozycjaParagonu> Items { get; set; } = new List<PozycjaParagonu>();
        [JsonIgnore]
        public Gospodarstwo? Gospodarstwo { get; set; }
        public double TotalAmount { get; set; }
    }
}
