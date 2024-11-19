namespace Tests.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SZGD.Server.Controllers;
using SZGD.Server.Models;
using SZGD.Server.Data;
using Xunit;

public class DomownikControllerTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly DomownikController _controller;

    public DomownikControllerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase("TestDomownikDatabase")
            .Options;
        _context = new ApplicationDbContext(options);
        _controller = new DomownikController(_context);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public async Task CreateDomownik_ReturnsBadRequest_WhenEmailOrUsernameExists()
    {
        var existingDomownik = new Domownik { Email = "existing@example.com", UserName = "existinguser" };
        _context.Domownicy.Add(existingDomownik);
        await _context.SaveChangesAsync();

        var newDomownik = new Domownik { Email = "existing@example.com", UserName = "newuser" };

        var result = await _controller.CreateDomownik(newDomownik);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badRequestResult.Value);
    }

    [Fact]
    public async Task GetDomownik_ReturnsNotFound_WhenDomownikDoesNotExist()
    {
        var result = await _controller.GetDomownik("non-existent-id");

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.NotNull(notFoundResult.Value);
    }

    [Fact]
    public async Task GetAllGospodarstwaForDomownik_ReturnsNotFound_WhenNoGospodarstwaFound()
    {
        var result = await _controller.GetAllGospodarstwaForDomownik("non-existent-domownik-id");

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.NotNull(notFoundResult.Value);
    }

    [Fact]
    public async Task GetDomownicy_ReturnsOkResult_WhenDomownicyExist()
    {
        var domownicy = new[]
        {
            new Domownik { Id = "1", Imie = "Jan", Nazwisko = "Kowalski" },
            new Domownik { Id = "2", Imie = "Anna", Nazwisko = "Nowak" }
        };
        _context.Domownicy.AddRange(domownicy);
        await _context.SaveChangesAsync();

        var result = await _controller.GetDomownicy();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsAssignableFrom<System.Collections.Generic.List<Domownik>>(okResult.Value);
        Assert.Equal(2, returnValue.Count);
    }
}
