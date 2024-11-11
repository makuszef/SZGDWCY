using System.Text.Json.Serialization;

namespace SZGD.Server.Models;

public class PrzeslanyPlik
{
    public int Id { get; set; }
    public string NazwaPliku { get; set; }
    public byte[] ZawartoscPliku { get; set; }
    public int GospodarstwoId { get; set; }
    [JsonIgnore]
    public Gospodarstwo? Gospodarstwo { get; set; }

    public PrzeslanyPlik(string nazwaPliku, byte[] zawartoscPliku)
    {
        NazwaPliku = nazwaPliku;
        ZawartoscPliku = zawartoscPliku;
    }
}
