using Microsoft.EntityFrameworkCore;
using SZGD.Server.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

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
                .WithOne()
                .HasForeignKey(e => e.DomownikId);
            modelBuilder.Entity<Gospodarstwo>()
                .HasMany(e => e.Sprzet);
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

        private void Seed(ModelBuilder modelBuilder)
        {
            ;
        }
    }
}
