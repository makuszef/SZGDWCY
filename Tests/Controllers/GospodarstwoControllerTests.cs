namespace Tests.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SZGD.Server.Controllers;
using SZGD.Server.Data;
using SZGD.Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class GospodarstwoControllerTests : IDisposable
{
    private readonly ApplicationDbContext _context;

    public GospodarstwoControllerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestGospodarstwoDatabase")
            .Options;
        _context = new ApplicationDbContext(options);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();  // Usuwa bazę danych po każdym teście
        _context.Dispose();
    }

    [Fact]
    public async Task GetAll_ReturnsAllGospodarstwa()
    {
        // Arrange
        _context.Gospodarstwa.Add(new Gospodarstwo { Id = 1, nazwa = "Dom A" });
        _context.Gospodarstwa.Add(new Gospodarstwo { Id = 2, nazwa = "Dom B" });
        await _context.SaveChangesAsync();

        var controller = new GospodarstwoController(_context);

        // Act
        var result = await controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var gospodarstwa = Assert.IsAssignableFrom<List<Gospodarstwo>>(okResult.Value);
        Assert.Equal(2, gospodarstwa.Count);
    }

    [Fact]
    public async Task GetById_ReturnsGospodarstwo_WhenExists()
    {
        // Arrange
        _context.Gospodarstwa.Add(new Gospodarstwo { Id = 1, nazwa = "Dom A" });
        await _context.SaveChangesAsync();

        var controller = new GospodarstwoController(_context);

        // Act
        var result = await controller.GetById(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var gospodarstwo = Assert.IsType<Gospodarstwo>(okResult.Value);
        Assert.Equal("Dom A", gospodarstwo.nazwa);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenDoesNotExist()
    {
        // Arrange
        var controller = new GospodarstwoController(_context);

        // Act
        var result = await controller.GetById(1);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Create_AddsNewGospodarstwo()
    {
        // Arrange
        var controller = new GospodarstwoController(_context);
        var newGospodarstwo = new DodajGospodarstwoRequest { id = 3, nazwa = "Dom C" };

        // Act
        var result = await controller.Create(newGospodarstwo);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var gospodarstwo = Assert.IsType<Gospodarstwo>(createdAtActionResult.Value);
        Assert.Equal("Dom C", gospodarstwo.nazwa);
    }

    [Fact]
    public async Task Update_UpdatesExistingGospodarstwo()
    {
        // Arrange
        _context.Gospodarstwa.Add(new Gospodarstwo { Id = 1, nazwa = "Dom A" });
        await _context.SaveChangesAsync();

        var controller = new GospodarstwoController(_context);
        var updatedGospodarstwo = new Gospodarstwo { Id = 1, nazwa = "Dom Zaktualizowany" };

        // Act
        var result = await controller.Update(1, updatedGospodarstwo);

        // Assert
        Assert.IsType<NoContentResult>(result);
        var gospodarstwo = await _context.Gospodarstwa.FindAsync(1);
        Assert.Equal("Dom Zaktualizowany", gospodarstwo.nazwa);
    }

    [Fact]
    public async Task Delete_RemovesGospodarstwo()
    {
        // Arrange
        _context.Gospodarstwa.Add(new Gospodarstwo { Id = 1, nazwa = "Dom A" });
        await _context.SaveChangesAsync();

        var controller = new GospodarstwoController(_context);

        // Act
        var result = await controller.Delete(1);

        // Assert
        Assert.IsType<NoContentResult>(result);
        Assert.Null(await _context.Gospodarstwa.FindAsync(1));
    }
}
