namespace Tests.Controllers;

using Xunit;
using SZGD.Server.Controllers;
using SZGD.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;


public class GospodarstwoControllerTests
{
    public GospodarstwoControllerTests()
    {
        // Resetowanie statycznej listy przed każdym testem
        typeof(GospodarstwoController)
            .GetField("_gospodarstwa", BindingFlags.NonPublic | BindingFlags.Static)
            .SetValue(null, new List<Gospodarstwo>());
    }
    
    [Fact]
    public void GetAll_ReturnsOkResult_WithListOfGospodarstwa()
    {
        // Arrange
        var controller = new GospodarstwoController();
        var gospodarstwo1 = new Gospodarstwo { nazwa = "Gospodarstwo 1", czlonkowie = new List<Domownik>() };
        var gospodarstwo2 = new Gospodarstwo { nazwa = "Gospodarstwo 2", czlonkowie = new List<Domownik>() };
        controller.Create(gospodarstwo1);
        controller.Create(gospodarstwo2);

        // Act
        var result = controller.GetAll();

        // Assert
        var actionResult = Assert.IsType<ActionResult<List<Gospodarstwo>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var gospodarstwa = Assert.IsType<List<Gospodarstwo>>(okResult.Value);
        Assert.Equal(2, gospodarstwa.Count);
    }
    
    [Fact]
    public void GetById_ExistingId_ReturnsOkResult()
    {
        // Arrange
        var controller = new GospodarstwoController();
        var gospodarstwo = new Gospodarstwo { nazwa = "Gospodarstwo Testowe", czlonkowie = new List<Domownik>() };
        controller.Create(gospodarstwo);

        // Act
        var result = controller.GetById(gospodarstwo.idGospodarstwa);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Gospodarstwo>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnedGospodarstwo = Assert.IsType<Gospodarstwo>(okResult.Value);
        Assert.Equal(gospodarstwo.idGospodarstwa, returnedGospodarstwo.idGospodarstwa);
        Assert.Equal(gospodarstwo.nazwa, returnedGospodarstwo.nazwa);
    }

    [Fact]
    public void GetById_UnknownId_ReturnsNotFound()
    {
        // Arrange
        var controller = new GospodarstwoController();

        // Act
        var result = controller.GetById(999);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Gospodarstwo>>(result);
        Assert.IsType<NotFoundResult>(actionResult.Result);
    }

    [Fact]
    public void Create_ValidGospodarstwo_ReturnsCreatedAtActionResult()
    {
        // Arrange
        var controller = new GospodarstwoController();
        var gospodarstwo = new Gospodarstwo { nazwa = "Nowe Gospodarstwo", czlonkowie = new List<Domownik>() };

        // Act
        var result = controller.Create(gospodarstwo);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Gospodarstwo>>(result);
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        var returnedGospodarstwo = Assert.IsType<Gospodarstwo>(createdAtActionResult.Value);
        Assert.Equal(gospodarstwo.nazwa, returnedGospodarstwo.nazwa);
        Assert.NotEqual(0, returnedGospodarstwo.idGospodarstwa);
    }

    [Fact]
    public void Update_ExistingId_ReturnsNoContent()
    {
        // Arrange
        var controller = new GospodarstwoController();
        var gospodarstwo = new Gospodarstwo { nazwa = "Gospodarstwo Do Aktualizacji", czlonkowie = new List<Domownik>() };
        controller.Create(gospodarstwo);

        var updatedGospodarstwo = new Gospodarstwo { nazwa = "Zaktualizowane Gospodarstwo", czlonkowie = new List<Domownik>() };

        // Act
        var result = controller.Update(gospodarstwo.idGospodarstwa, updatedGospodarstwo);

        // Assert
        Assert.IsType<NoContentResult>(result);
        var fetchedGospodarstwo = controller.GetById(gospodarstwo.idGospodarstwa);
        var actionResult = Assert.IsType<ActionResult<Gospodarstwo>>(fetchedGospodarstwo);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnedGospodarstwo = Assert.IsType<Gospodarstwo>(okResult.Value);
        Assert.Equal(updatedGospodarstwo.nazwa, returnedGospodarstwo.nazwa);
    }

    [Fact]
    public void Update_UnknownId_ReturnsNotFound()
    {
        // Arrange
        var controller = new GospodarstwoController();
        var updatedGospodarstwo = new Gospodarstwo { nazwa = "Nieistniejące Gospodarstwo", czlonkowie = new List<Domownik>() };

        // Act
        var result = controller.Update(999, updatedGospodarstwo);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void Delete_ExistingId_ReturnsNoContent()
    {
        // Arrange
        var controller = new GospodarstwoController();
        var gospodarstwo = new Gospodarstwo { nazwa = "Gospodarstwo Do Usunięcia", czlonkowie = new List<Domownik>() };
        controller.Create(gospodarstwo);

        // Act
        var result = controller.Delete(gospodarstwo.idGospodarstwa);

        // Assert
        Assert.IsType<NoContentResult>(result);
        var fetchResult = controller.GetById(gospodarstwo.idGospodarstwa);
        var actionResult = Assert.IsType<ActionResult<Gospodarstwo>>(fetchResult);
        Assert.IsType<NotFoundResult>(actionResult.Result);
    }

    [Fact]
    public void Delete_UnknownId_ReturnsNotFound()
    {
        // Arrange
        var controller = new GospodarstwoController();

        // Act
        var result = controller.Delete(999);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void AddDomownik_ExistingGospodarstwo_AddsDomownik()
    {
        // Arrange
        var controller = new GospodarstwoController();
        var gospodarstwo = new Gospodarstwo { nazwa = "Gospodarstwo z Domownikami", czlonkowie = new List<Domownik>() };
        controller.Create(gospodarstwo);

        var newDomownik = new Domownik
        {
            Imie = "Jan",
            Nazwisko = "Kowalski",
            Email = "jan.kowalski@example.com",
            Telefon = "123456789",
            Nazwa_uzytkownika = "jkowalski"
        };

        // Act
        var result = controller.AddDomownik(gospodarstwo.idGospodarstwa, newDomownik);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        var returnedDomownik = Assert.IsType<Domownik>(createdAtActionResult.Value);
        Assert.Equal(newDomownik.Imie, returnedDomownik.Imie);
        Assert.Equal(1, returnedDomownik.id_domownika);

        // Sprawdzenie, czy domownik został dodany do gospodarstwa
        var fetchResult = controller.GetById(gospodarstwo.idGospodarstwa);
        var actionResult = Assert.IsType<ActionResult<Gospodarstwo>>(fetchResult);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var updatedGospodarstwo = Assert.IsType<Gospodarstwo>(okResult.Value);
        Assert.Single(updatedGospodarstwo.czlonkowie);
        Assert.Equal(newDomownik.Imie, updatedGospodarstwo.czlonkowie.First().Imie);
    }

    [Fact]
    public void AddDomownik_UnknownGospodarstwo_ReturnsNotFound()
    {
        // Arrange
        var controller = new GospodarstwoController();
        var newDomownik = new Domownik
        {
            Imie = "Anna",
            Nazwisko = "Nowak",
            Email = "anna.nowak@example.com",
            Telefon = "987654321",
            Nazwa_uzytkownika = "anowak"
        };

        // Act
        var result = controller.AddDomownik(999, newDomownik);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        var message = Assert.IsType<string>(notFoundResult.Value);
        Assert.Equal("Gospodarstwo o podanym ID nie istnieje.", message);
    }

    
    
}