namespace SZGD.Server.Models;

public class Uprawnienia
{
    public int Id { get; set; } // Klucz główny
    public bool CzyMozeCzytacInformacjeMedyczne { get; set; } = false;
    public bool CzyMozeCzytaćInformacjeOSprzecie { get; set; } = false;
}