using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace SZGD.Server.Models
{
    public class Domownik :IdentityUser
    {
        public string? Imie { get; set; } 
        public string? Nazwisko { get; set; } 

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
