using Microsoft.EntityFrameworkCore;
using SZGD.Server.Models;
using System.Collections.Generic;

namespace SZGD.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Domownik> Domownicy { get; set; }
        public DbSet<Uprawnienia> Uprawnienia { get; set; }
        public DbSet<Gospodarstwo> Gospodarstwa { get; set; }
        public DbSet<Paragon> Paragony { get; set; }
        public DbSet<PozycjaParagonu> PozycjeParagonu { get; set; }
        public DbSet<PrzeslanyPlik> Pliki { get; set; }
        public DbSet<Sprzet> Sprzet { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Paragon>()
                .HasMany(p => p.Items)
                .WithOne(p => p.Paragon);
            modelBuilder.Entity<Domownik>()
                .HasMany(d => d.Gospodarstwa)
                .WithMany(e => e.czlonkowie);
            modelBuilder.Entity<Gospodarstwo>()
                .HasMany(e => e.Sprzet)
                .WithOne(e => e.Gospodarstwo);
            modelBuilder.Entity<Gospodarstwo>()
                .HasMany(e => e.czlonkowie)
                .WithMany(e => e.Gospodarstwa)
                .UsingEntity("DomownikWGospodarstwie");
            modelBuilder.Entity<Gospodarstwo>()
                .HasMany(e => e.Paragony)
                .WithOne(e => e.Gospodarstwo);
            modelBuilder.Entity<Sprzet>()
                .HasMany(e => e.HistoriaUzyciaSprzetu)
                .WithOne(e => e.Sprzet);
            Seed(modelBuilder);
        }

        private void Seed(ModelBuilder modelBuilder)
        {
            ;
        }
    }
}
