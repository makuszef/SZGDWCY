using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SZGD.Server.Models
{
    public class PrzeslanyPlik
    {
        [Key, ForeignKey(nameof(Paragon))]
        public int ParagonId { get; set; }
        public string NazwaPliku { get; set; }
        public byte[] ZawartoscPliku { get; set; }

        [JsonIgnore]
        public Paragon Paragon { get; set; }
    }
}