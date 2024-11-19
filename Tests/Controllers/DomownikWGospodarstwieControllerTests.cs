namespace Tests.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SZGD.Server.Controllers;
using SZGD.Server.Data;
using SZGD.Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class DomownikWGospodarstwieControllerTests : IDisposable
{
    private readonly ApplicationDbContext _context;

    public DomownikWGospodarstwieControllerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

        _context = new ApplicationDbContext(options);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public async Task GetAllDomownicyWGospodarstwie_ReturnsAllEntries()
    {
        // Arrange
        _context.DomownikWGospodarstwie.Add(new DomownikWGospodarstwie { DomownikId = "1", GospodarstwoId = 1 });
        _context.DomownikWGospodarstwie.Add(new DomownikWGospodarstwie { DomownikId = "2", GospodarstwoId = 2 });
    
        await _context.SaveChangesAsync();

        // Sprawdź odczytanie
        Assert.Equal(2, await _context.DomownikWGospodarstwie.CountAsync());

        var controller = new DomownikWGospodarstwieController(_context);

        // Act
        var result = await controller.GetAllDomownicyWGospodarstwie();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
    }



    [Fact]
    public async Task GetDomownikWGospodarstwieById_ReturnsEntry_WhenExists()
    {
        // Arrange
        var entry = new DomownikWGospodarstwie { GospodarstwoId = 1, DomownikId = "1" };
        _context.Set<DomownikWGospodarstwie>().Add(entry);
        await _context.SaveChangesAsync();

        var controller = new DomownikWGospodarstwieController(_context);

        // Act
        var result = await controller.GetDomownikWGospodarstwieById(1);

        // Assert
        Assert.IsType<OkObjectResult>(new OkObjectResult(entry));
        var retrievedEntry = Assert.IsType<DomownikWGospodarstwie>(entry);
        Assert.Equal(entry.GospodarstwoId, retrievedEntry.GospodarstwoId);
        Assert.Equal(entry.DomownikId, retrievedEntry.DomownikId);
    }


    [Fact]
    public async Task GetDomownikWGospodarstwieById_ReturnsNotFound_WhenDoesNotExist()
    {
        // Arrange
        var controller = new DomownikWGospodarstwieController(_context);

        // Act
        var result = await controller.GetDomownikWGospodarstwieById(999); // Tylko jeden parametr

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task DodajDomownikaDoGospodarstwa_AddsNewEntry()
    {
        // Arrange
        var controller = new DomownikWGospodarstwieController(_context);

        // Dodaj testowe dane dla Domownika i Gospodarstwa
        var domownik = new Domownik { Id = "1", Imie = "Test Domownik" };
        var gospodarstwo = new Gospodarstwo { Id = 1, nazwa = "Testowe Gospodarstwo" }; // Właściwość "nazwa" ustawiona

        _context.Domownicy.Add(domownik);
        _context.Gospodarstwa.Add(gospodarstwo);
        await _context.SaveChangesAsync();

        var newEntry = new DodajDomownikaRequest
        {
            DomownikId = "1",
            GospodarstwoId = 1,
            CzyWlasciciel = true
        };

        // Act
        var result = await controller.DodajDomownikaDoGospodarstwa(newEntry);

        // Assert
        var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var entry = Assert.IsType<DomownikWGospodarstwie>(createdAtResult.Value);
        Assert.Equal("1", entry.DomownikId);
        Assert.Equal(1, entry.GospodarstwoId);
    }
}
