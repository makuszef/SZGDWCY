namespace SZGD.Server.Models;

public class Gospodarstwo
{
    // Właściwości klasy Domownik
    public int Id { get; set; }
    public string nazwa { get; set; }
    public List<Domownik> Czlonkowie { get; set; }
    public int KodDostepu { get; set; }
}