using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SZGD.Server.Controllers;
using SZGD.Server.Data;
using SZGD.Server.Models;
using Xunit;

public class SprzetControllerTests
{
    private readonly ApplicationDbContext _context;

    public SprzetControllerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

        _context = new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetSprzety_ReturnsAllSprzety()
    {
        // Arrange
        _context.Sprzet.Add(new Sprzet
        {
            GospodarstwoId = 1,
            Nazwa = "Sprzęt 1",
            Typ = "Typ 1",
            Status = StatusSprzetu.Dostepny,
            Opis = "Opis sprzętu 1" // Dodano wymagane pole
        });
    
        _context.Sprzet.Add(new Sprzet
        {
            GospodarstwoId = 1,
            Nazwa = "Sprzęt 2",
            Typ = "Typ 2",
            Status = StatusSprzetu.Dostepny,
            Opis = "Opis sprzętu 2" // Dodano wymagane pole
        });

        await _context.SaveChangesAsync();

        var controller = new SprzetController(_context);

        // Act
        var result = await controller.GetSprzety();

        // Assert
        var okResult = Assert.IsType<ActionResult<IEnumerable<Sprzet>>>(result);
        Assert.NotNull(okResult.Value);
        Assert.Equal(2, okResult.Value.Count());
    }

    [Fact]
    public async Task GetSprzet_ReturnsSprzet_WhenExists()
    {
        // Arrange
        var sprzet = new Sprzet
        {
            GospodarstwoId = 1,
            Nazwa = "Sprzęt 1",
            Typ = "Typ 1",
            Status = StatusSprzetu.Dostepny,
            Opis = "Przykładowy opis" // Dodano wymagane pole
        };

        _context.Sprzet.Add(sprzet);
        await _context.SaveChangesAsync();

        var controller = new SprzetController(_context);

        // Act
        var result = await controller.GetSprzet(sprzet.Id);

        // Assert
        var okResult = Assert.IsType<ActionResult<Sprzet>>(result);
        Assert.NotNull(okResult.Value);
        Assert.Equal(sprzet.Nazwa, okResult.Value.Nazwa);
        Assert.Equal("Przykładowy opis", okResult.Value.Opis); // Sprawdzenie Opis
    }


    [Fact]
    public async Task GetSprzet_ReturnsNotFound_WhenNotExists()
    {
        // Arrange
        var controller = new SprzetController(_context);

        // Act
        var result = await controller.GetSprzet(999);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task CreateSprzet_CreatesNewSprzet()
    {
        // Arrange
        var controller = new SprzetController(_context);
        var newSprzet = new Sprzet
        {
            GospodarstwoId = 1,
            Nazwa = "Sprzęt 3",
            Typ = "Typ 3",
            Status = StatusSprzetu.Dostepny,
            Opis = "Przykładowy opis"
        };

        // Act
        var result = await controller.CreateSprzet(newSprzet);

        // Assert
        var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result); // Oczekuj CreatedAtActionResult
        var createdSprzet = Assert.IsType<Sprzet>(createdAtResult.Value); // Sprawdź, czy zwrócono obiekt Sprzet
        Assert.Equal("Sprzęt 3", createdSprzet.Nazwa);
    }

    [Fact]
    public async Task UpdateSprzet_UpdatesExistingSprzet()
    {
        // Arrange
        var sprzet = new Sprzet
        {
            GospodarstwoId = 1,
            Nazwa = "Sprzęt 1",
            Typ = "Typ 1",
            Status = StatusSprzetu.Dostepny,
            Opis = "Początkowy opis"
        };

        // Dodaj sprzęt do bazy
        _context.Sprzet.Add(sprzet);
        await _context.SaveChangesAsync();

        // Zaktualizuj obiekt Sprzet z tym samym Id
        var updatedSprzet = new Sprzet
        {
            Id = sprzet.Id,  // Użyj tego samego ID, aby wskazać tę samą encję
            GospodarstwoId = 1,
            Nazwa = "Zaktualizowany Sprzęt",
            Typ = "Typ 1",
            Status = StatusSprzetu.Dostepny,
            Opis = "Zaktualizowany opis"
        };

        // Upewnij się, że encja jest tylko śledzona raz
        _context.Entry(sprzet).State = EntityState.Detached; // Usuwamy poprzednią instancję z kontekstu

        // Używamy Update, żeby EF automatycznie rozpoznało, że to istniejąca encja
        _context.Sprzet.Update(updatedSprzet);

        var controller = new SprzetController(_context);

        // Act
        var result = await controller.UpdateSprzet(updatedSprzet);

        // Assert
        var noContentResult = Assert.IsType<NoContentResult>(result);

        var updatedInDb = await _context.Sprzet.FindAsync(sprzet.Id);
        Assert.NotNull(updatedInDb);
        Assert.Equal("Zaktualizowany Sprzęt", updatedInDb.Nazwa);
        Assert.Equal("Zaktualizowany opis", updatedInDb.Opis);
    }


}
