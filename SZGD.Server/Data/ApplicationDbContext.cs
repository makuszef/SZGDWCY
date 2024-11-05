using Microsoft.EntityFrameworkCore;
using SZGD.Server.Models;

namespace SZGD.Server.Data;


public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Domownik> Domownicy { get; set; } // Replace with your entity
    public DbSet<Uprawnienia> Uprawnienia { get; set; } // Replace with your entity
}
