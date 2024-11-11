using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SZGD.Server.Models
{
    public class Paragon
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Gospodarstwo))]
        public int GospodarstwoId { get; set; }
        public Gospodarstwo Gospodarstwo { get; set; }

        public string Date { get; set; }
        public string StoreName { get; set; }
        public List<PozycjaParagonu> Items { get; set; } = new List<PozycjaParagonu>();
        public double TotalAmount { get; set; }

        // Relacja jeden-do-jeden z PrzeslanyPlik
        public PrzeslanyPlik PrzeslanyPlik { get; set; }
    }
}