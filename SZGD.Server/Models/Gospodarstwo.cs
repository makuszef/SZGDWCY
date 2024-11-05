namespace SZGD.Server.Models;

public class Gospodarstwo
{
    // Właściwości klasy Domownik
    public int idGospodarstwa { get; set; }
    public string nazwa { get; set; }
    public List<Domownik> czlonkowie { get; set; }
}