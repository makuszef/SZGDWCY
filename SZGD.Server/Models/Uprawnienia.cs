namespace SZGD.Server.Models;

public class Uprawnienia
{
    public int Id { get; set; } // Klucz główny
    public bool CzyWidziInformacjeMedyczneDomownikow { get; set; } = false;
    public bool CzyWidziSprzet { get; set; } = false;
    public bool CzyWidziDomownikow { get; set; } = false;
    public bool CzyMozeModyfikowacDomownikow { get; set; } = false;
    public bool CzyMozeModyfikowacGospodarstwo { get; set; } = false;
    public bool CzyMozePrzesylacPliki { get; set; } = false;
    public Domownik Domownik { get; set; }
}