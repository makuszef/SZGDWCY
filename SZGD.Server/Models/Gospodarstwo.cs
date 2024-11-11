
using System.Text.Json.Serialization;

namespace SZGD.Server.Models;

public class Gospodarstwo
{
    // Właściwości klasy Domownik
    public int Id { get; set; }
    public string nazwa { get; set; }
    [JsonIgnore]
    public List<Sprzet>? Sprzet { get; set; }
    [JsonIgnore]
    public List<Paragon>? Paragony { get; set; }
    [JsonIgnore]
    public List<DomownikWGospodarstwie>? DomownikWGospodarstwie { get; set; }
    [JsonIgnore]
    public List<PrzeslanyPlik>? PrzeslanyPlik { get; set; }
}