using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SZGD.Server.Models
{
    public class Gwarancja
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Gospodarstwo))]
        public int GospodarstwoId { get; set; }
        public Gospodarstwo Gospodarstwo { get; set; }

        public string WarrantyDate { get; set; }              // Data wystawienia gwarancji
        public string WarrantyStoreName { get; set; }         // Nazwa sklepu
        public double WarrantyTotalAmount { get; set; }       // Kwota

        // Dodatkowe atrybuty
        public string NazwaGwarancji { get; set; }            // Nazwa gwarancji
        public DateTime DataZakonczeniaGwarancji { get; set; } // Data zakończenia gwarancji

        // Pola przechowujące informacje o pliku gwarancji
        public string WarrantyFileName { get; set; }
        public byte[] WarrantyFileContent { get; set; }
    }
}