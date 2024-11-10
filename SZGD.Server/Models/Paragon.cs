using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SZGD.Server.Models
{
    public class Paragon
    {
        // Właściwości klasy Dokument
        public int Id {get;set;}
        [ForeignKey(nameof(Gospodarstwo))]
        public int GospodarstwoId {get;set;}
        public string Date { get; set; }
        public string StoreName { get; set; }
        public List<PozycjaParagonu> Items { get; set; } = new List<PozycjaParagonu>();
        public double TotalAmount { get; set; }
    }
}
