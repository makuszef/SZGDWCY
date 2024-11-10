namespace SZGD.Server.Models;

public class Gospodarstwo
{
    // Właściwości klasy Domownik
    public int Id { get; set; }
    public string nazwa { get; set; }
    public List<Sprzet> Sprzet { get; set; }
    public List<Paragon> Paragony { get; set; }
    public List<DomownikWGospodarstwie>? DomownikWGospodarstwie { get; set; }
}