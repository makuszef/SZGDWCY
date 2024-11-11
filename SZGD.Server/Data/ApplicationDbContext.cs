using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using SZGD.Server.Models;

namespace SZGD.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Domownik> Domownicy { get; set; }
        public DbSet<DomownikWGospodarstwie> DomownikWGospodarstwie { get; set; }
        public DbSet<Gospodarstwo> Gospodarstwa { get; set; }
        public DbSet<Paragon> Paragony { get; set; }
        public DbSet<PozycjaParagonu> PozycjeParagonu { get; set; }
        public DbSet<PrzeslanyPlik> Pliki { get; set; }
        public DbSet<Sprzet> Sprzet { get; set; }
        public DbSet<HistoriaUzyciaSprzetu> HistoriaUzyciaSprzetu { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<DomownikWGospodarstwie>()
                .HasKey(e => new { e.GospodarstwoId, e.DomownikId });
            modelBuilder.Entity<Paragon>()
                .HasMany(p => p.Items);
            modelBuilder.Entity<Domownik>()
                .HasMany(d => d.DomownikWGospodarstwie)
                .WithOne(e => e.Domownik)
                .HasForeignKey(e => e.DomownikId);
            modelBuilder.Entity<Gospodarstwo>()
                .HasMany(e => e.Sprzet);
            modelBuilder.Entity<Gospodarstwo>()
                .HasMany(e => e.PrzeslanyPlik)
                .WithOne(e => e.Gospodarstwo)
                .HasForeignKey(e => e.GospodarstwoId);
            modelBuilder.Entity<Gospodarstwo>()
                .HasMany(e => e.DomownikWGospodarstwie);
            modelBuilder.Entity<Gospodarstwo>()
                .HasMany(e => e.Paragony);
            modelBuilder.Entity<Sprzet>()
                .HasMany(e => e.HistoriaUzyciaSprzetu)
                .WithOne(e => e.Sprzet)
                .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<HistoriaUzyciaSprzetu>()
                .HasOne(h => h.DomownikWGospodarstwie)
                .WithMany(dw => dw.HistoriaUzyciaSprzetu)
                .HasForeignKey(h => new { h.GospodarstwoId, h.DomownikId})
                .OnDelete(DeleteBehavior.Cascade);
            Seed(modelBuilder);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.ConfigureWarnings(warnings => 
                warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        }

        private void Seed(ModelBuilder modelBuilder)
        {
            // Seed data for Gospodarstwo (Household)
            modelBuilder.Entity<Gospodarstwo>().HasData(
                new Gospodarstwo { Id = 1, nazwa = "Dom A" },
                new Gospodarstwo { Id = 2, nazwa = "Dom B" }
            );

            // Seed data for Domownik (Household Members)
            modelBuilder.Entity<Domownik>().HasData(
                new Domownik { Id = "1", UserName = "anna", Imie = "Anna", Nazwisko = "Nowak", Email = "anna.nowak@example.com" },
                new Domownik { Id = "2", UserName = "jan", Imie = "Jan", Nazwisko = "Kowalski", Email = "jan.kowalski@example.com" },
                new Domownik { Id = "3", UserName = "maria", Imie = "Maria", Nazwisko = "Zalewska", Email = "maria.zalewska@example.com" }
            );

            // Seed data for DomownikWGospodarstwie (Associating Household Members with Households)
            modelBuilder.Entity<DomownikWGospodarstwie>().HasData(
                new DomownikWGospodarstwie { DomownikId = "1", GospodarstwoId = 1, Rola = DomownikRole.Rodzic },  // Parent
                new DomownikWGospodarstwie { DomownikId = "2", GospodarstwoId = 1, Rola = DomownikRole.Rodzic },  // Parent
                new DomownikWGospodarstwie { DomownikId = "3", GospodarstwoId = 2, Rola = DomownikRole.Dziecko } // Child
            );

            // Seed data for Sprzet (Household Equipment)
            modelBuilder.Entity<Sprzet>().HasData(
                new Sprzet { Id = 1, GospodarstwoId = 1, Nazwa = "Pralka", Typ = "Sprzęt AGD", Status = StatusSprzetu.Dostepny, Opis = "Automatyczna pralka" },
                new Sprzet { Id = 2, GospodarstwoId = 1, Nazwa = "Lodówka", Typ = "Sprzęt AGD", Status = StatusSprzetu.WNaprawie, Opis = "Nowoczesna lodówka" },
                new Sprzet { Id = 3, GospodarstwoId = 2, Nazwa = "Odkurzacz", Typ = "Sprzęt AGD", Status = StatusSprzetu.Dostepny, Opis = "Odkurzacz bezprzewodowy" }
            );

            // Seed data for Paragon (Receipts for Household Items)
            modelBuilder.Entity<Paragon>().HasData(
                new Paragon { Id = 1, GospodarstwoId = 1, Date = "2023-01-15", StoreName = "RTV Euro AGD", TotalAmount = 1500.0 },
                new Paragon { Id = 2, GospodarstwoId = 2, Date = "2023-02-20", StoreName = "Media Markt", TotalAmount = 600.0 }
            );

            // Seed data for PozycjaParagonu (Items on Household Receipts)
            modelBuilder.Entity<PozycjaParagonu>().HasData(
                new PozycjaParagonu { Id = 1, ParagonId = 1, Name = "Pralka", Price = 1000.0, Quantity = 1 },
                new PozycjaParagonu { Id = 2, ParagonId = 1, Name = "Lodówka", Price = 500.0, Quantity = 1 },
                new PozycjaParagonu { Id = 3, ParagonId = 2, Name = "Odkurzacz", Price = 600.0, Quantity = 1 }
            );

            // Seed data for HistoriaUzyciaSprzetu (Household Equipment Usage History)
            modelBuilder.Entity<HistoriaUzyciaSprzetu>().HasData(
                new HistoriaUzyciaSprzetu { Id = 1, SprzetId = 1, DomownikId = "1", GospodarstwoId = 1, DataUzycia = new DateTime(2023, 02, 10), CzyWystapilaAwaria = false, KomentarzDoAwarii = "" },
                new HistoriaUzyciaSprzetu { Id = 2, SprzetId = 2, DomownikId = "2", GospodarstwoId = 1, DataUzycia = new DateTime(2023, 03, 12), CzyWystapilaAwaria = true, KomentarzDoAwarii = "Pęknięta uszczelka" }
            );
        }
    }
}
