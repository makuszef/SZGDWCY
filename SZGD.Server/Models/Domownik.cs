using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace SZGD.Server.Models
{
    public class Domownik :IdentityUser
    {
        public string? Imie { get; set; } 
        public string? Nazwisko { get; set; } 
        [JsonIgnore]
        public List<DomownikWGospodarstwie>? DomownikWGospodarstwie { get; set; }
        // Konstruktor domyślny
        public Domownik() { }
        
        // Konstruktor z parametrami
        public Domownik(string imie, string nazwisko)
        {
            Imie = imie;
            Nazwisko = nazwisko;
        }
        public List<HistoriaUzyciaSprzetu>? HistoriaUzyciaSprzetu { get; set;}
    }

}
