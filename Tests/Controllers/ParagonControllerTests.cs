using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SZGD.Server.Controllers;
using SZGD.Server.Models;
using SZGD.Server.Data;
using Xunit;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

public class ParagonControllerTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly ParagonController _controller;

    public ParagonControllerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase("TestParagonDatabase")
            .Options;
        _context = new ApplicationDbContext(options);
        _controller = new ParagonController(_context);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public async Task CreateParagon_ReturnsBadRequest_WhenDataIsInvalid()
    {
        var paragon = new Paragon
        {
            Date = "",  // Invalid data
            StoreName = "",
            Items = null,  // Invalid data
            TotalAmount = -1  // Invalid data
        };

        var result = await _controller.CreateParagon(paragon);

        // Zmieniamy sprawdzenie, aby uwzględniało 'result.Result', ponieważ kontroler zwraca ActionResult<Paragon>
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badRequestResult.Value);  // Upewniamy się, że odpowiedź zawiera jakąś wartość
    }


    [Fact]
    public async Task CreateParagon_ReturnsCreated_WhenDataIsValid()
    {
        var paragon = new Paragon
        {
            Date = "2024-11-19",
            StoreName = "Store A",
            Items = new List<PozycjaParagonu>
            {
                new PozycjaParagonu { Name = "Item1", Price = 50 },
                new PozycjaParagonu { Name = "Item2", Price = 150 }
            },
            TotalAmount = 200
        };

        var result = await _controller.CreateParagon(paragon);

        // Zmieniamy sprawdzenie, aby uwzględniało wynik w 'result.Result'
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(201, createdResult.StatusCode);

        // Dodatkowe sprawdzenie, aby upewnić się, że obiekt zwrócony to paragon
        var returnValue = Assert.IsType<Paragon>(createdResult.Value);
        Assert.Equal(paragon.Date, returnValue.Date); // Sprawdzamy, czy zwrócony paragon ma odpowiednią datę
    }


    [Fact]
    public async Task GetAllParagon_ReturnsOk_WhenParagonsExist()
    {
        var paragon = new Paragon { Date = "2024-11-19", StoreName = "Store A", TotalAmount = 200 };
        _context.Paragony.Add(paragon);
        await _context.SaveChangesAsync();

        var result = await _controller.GetAllParagon();

        // Zmieniamy sprawdzenie, aby uwzględniało 'result.Result'
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsAssignableFrom<IEnumerable<Paragon>>(okResult.Value);
        Assert.True(returnValue.Any());  // Sprawdzamy, czy zwrócona lista zawiera paragon
    }


    [Fact]
    public async Task GetParagonById_ReturnsNotFound_WhenParagonDoesNotExist()
    {
        var result = await _controller.GetParagonById(999); // Non-existent ID

        // Zmieniamy sprawdzenie, aby uwzględniało 'result.Result'
        var notFoundResult = Assert.IsType<NotFoundResult>(result.Result);  // Uzyskujemy dostęp do result.Result
    }


    [Fact]
    public async Task GetParagonById_ReturnsOk_WhenParagonExists()
    {
        var paragon = new Paragon { Date = "2024-11-19", StoreName = "Store A", TotalAmount = 200 };
        _context.Paragony.Add(paragon);
        await _context.SaveChangesAsync();

        var result = await _controller.GetParagonById(paragon.Id);

        // Zmieniamy sprawdzenie, aby uwzględniało 'result.Result'
        var okResult = Assert.IsType<OkObjectResult>(result.Result);  // Uzyskujemy dostęp do result.Result
        var returnValue = Assert.IsType<Paragon>(okResult.Value);  // Sprawdzamy, czy zawartość odpowiedzi to Paragon
        Assert.Equal(paragon.Id, returnValue.Id);  // Sprawdzamy, czy ID paragonu się zgadza
    }


    [Fact]
    public async Task UpdateParagon_ReturnsNotFound_WhenParagonDoesNotExist()
    {
        var updatedParagon = new Paragon { Date = "2024-11-19", StoreName = "Store A", TotalAmount = 200 };
        var result = await _controller.UpdateParagon(999, updatedParagon); // Non-existent ID

        var notFoundResult = Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeleteParagon_ReturnsNotFound_WhenParagonDoesNotExist()
    {
        var result = await _controller.DeleteParagon(999); // Non-existent ID

        var notFoundResult = Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeleteParagon_ReturnsNoContent_WhenParagonExists()
    {
        var paragon = new Paragon { Date = "2024-11-19", StoreName = "Store A", TotalAmount = 200 };
        _context.Paragony.Add(paragon);
        await _context.SaveChangesAsync();

        var result = await _controller.DeleteParagon(paragon.Id);

        var noContentResult = Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task GetParagonyByGospodarstwoId_ReturnsOk_WhenParagonsExistForGospodarstwo()
    {
        var gospodarstwoId = 1;
        var paragon = new Paragon { GospodarstwoId = gospodarstwoId, Date = "2024-11-19", StoreName = "Store A", TotalAmount = 200 };
        _context.Paragony.Add(paragon);
        await _context.SaveChangesAsync();

        var result = await _controller.GetParagonyByGospodarstwoId(gospodarstwoId);

        // Sprawdzamy, czy wynik jest typu OkObjectResult
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsAssignableFrom<IEnumerable<Paragon>>(okResult.Value);
        Assert.True(returnValue.Any());  // Sprawdzamy, czy zwrócona lista zawiera jakiekolwiek paragon
    }


    [Fact]
    public async Task GetParagonyByGospodarstwoId_ReturnsNotFound_WhenNoParagonsFoundForGospodarstwo()
    {
        var result = await _controller.GetParagonyByGospodarstwoId(999); // Non-existent Gospodarstwo ID

        // Zmieniamy sprawdzenie, aby uwzględniało 'result.Result'
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);  // Uzyskujemy dostęp do result.Result
        Assert.Equal("Nie znaleziono paragonów dla podanego gospodarstwa.", notFoundResult.Value);  // Sprawdzamy komunikat o błędzie
    }

}
