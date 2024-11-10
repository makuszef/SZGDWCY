using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace SZGD.Server.Models
{
    public class Domownik :IdentityUser
    {
        public string? Imie { get; set; } 
        public string? Nazwisko { get; set; } 
        
        public List<DomownikWGospodarstwie>? DomownikWGospodarstwie { get; set; }
        // Konstruktor domyślny
        public Domownik() { }
        
        // Konstruktor z parametrami
        public Domownik(string imie, string nazwisko)
        {
            Imie = imie;
            Nazwisko = nazwisko;
        }
    }

}
