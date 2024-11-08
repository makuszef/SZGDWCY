namespace SZGD.Server.Models;

public class PrzeslanyPlik
{
    public string NazwaPliku { get; set; }
    public byte[] ZawartoscPliku { get; set; }

    public PrzeslanyPlik(string nazwaPliku, byte[] zawartoscPliku)
    {
        NazwaPliku = nazwaPliku;
        ZawartoscPliku = zawartoscPliku;
    }
}
