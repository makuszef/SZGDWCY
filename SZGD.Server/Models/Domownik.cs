using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace SZGD.Server.Models
{
    public class Domownik
    {
        // Właściwości klasy Domownik
        [Key]
        public int id_domownika { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Email { get; set; }
        public string Telefon { get; set; }
        public string Nazwa_uzytkownika { get; set; }

        // Konstruktor domyślny
        public Domownik() { }

        // Konstruktor z parametrami
        public Domownik(int idDomownika, string imie, string nazwisko, string email, string telefon, string nazwa_uzytkownika)
        {
            id_domownika = idDomownika;
            Imie = imie;
            Nazwisko = nazwisko;
            Email = email;
            Telefon = telefon;
            this.Nazwa_uzytkownika = nazwa_uzytkownika;
        }
    }

}
