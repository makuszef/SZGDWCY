using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SZGD.Server.Models;

public class PozycjaParagonu
{
    public int Id { get; set; }
    [ForeignKey(nameof(Domownik))]
    public int ParagonuId { get; set; }
    public string Name { get; set; }
    public double Price { get; set; }
    public int Quantity { get; set; }
    public int ParagonId { get; set; }
}