using Xunit;
using SZGD.Server.Controllers;
using SZGD.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Tests.Controllers
{
    public class DomownikControllerTests
    {
        public DomownikControllerTests()
        {
            // Resetowanie statycznej listy przed każdym testem
            typeof(DomownikController)
                .GetField("_domownicy", BindingFlags.NonPublic | BindingFlags.Static)
                .SetValue(null, new List<Domownik>());
        }

        [Fact]
        public void GetDomownicy_ReturnsOkResult_WithListOfDomownicy()
        {
            // Arrange
            var controller = new DomownikController();
            var domownik1 = new Domownik { Imie = "Jan", Nazwisko = "Kowalski" };
            var domownik2 = new Domownik { Imie = "Anna", Nazwisko = "Nowak" };
            controller.CreateDomownik(domownik1);
            controller.CreateDomownik(domownik2);

            // Act
            var result = controller.GetDomownicy();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Domownik>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var domownicy = Assert.IsType<List<Domownik>>(okResult.Value);
            Assert.Equal(2, domownicy.Count);
        }


        [Fact]
        public void GetDomownik_UnknownId_ReturnsNotFoundResult()
        {
            // Arrange
            var controller = new DomownikController();

            // Act
            var result = controller.GetDomownik(999);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Domownik>>(result);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(actionResult.Result);
            var errorResponse = Assert.IsType<ErrorResponse>(notFoundResult.Value);
            Assert.Equal("Domownik not found", errorResponse.Message);
        }




        [Fact]
        public void GetDomownik_ExistingId_ReturnsOkObjectResult_WithDomownik()
        {
            // Arrange
            var controller = new DomownikController();
            var domownik = new Domownik
            {
                Imie = "Jan",
                Nazwisko = "Kowalski",
                Email = "jan.kowalski@example.com",
                Telefon = "123456789",
                Nazwa_uzytkownika = "jkowalski"
            };
            controller.CreateDomownik(domownik);

            // Act
            var result = controller.GetDomownik(domownik.id_domownika);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Domownik>>(result);
    
            // Jeśli metoda zwraca Ok(domownik)
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedDomownik = Assert.IsType<Domownik>(okResult.Value);

            // Porównanie właściwości
            Assert.Equal(domownik.id_domownika, returnedDomownik.id_domownika);
            Assert.Equal(domownik.Imie, returnedDomownik.Imie);
            Assert.Equal(domownik.Nazwisko, returnedDomownik.Nazwisko);
            Assert.Equal(domownik.Email, returnedDomownik.Email);
            Assert.Equal(domownik.Telefon, returnedDomownik.Telefon);
            Assert.Equal(domownik.Nazwa_uzytkownika, returnedDomownik.Nazwa_uzytkownika);
        }


        [Fact]
        public void CreateDomownik_ValidObject_ReturnsCreatedAtActionResult()
        {
            // Arrange
            var controller = new DomownikController();
            var domownik = new Domownik
            {
                Imie = "Anna",
                Nazwisko = "Nowak",
                Email = "anna.nowak@example.com",
                Telefon = "123456789",
                Nazwa_uzytkownika = "annowak"
            };

            // Act
            var result = controller.CreateDomownik(domownik);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Domownik>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var returnedDomownik = Assert.IsType<Domownik>(createdAtActionResult.Value);

            Assert.Equal(domownik.Imie, returnedDomownik.Imie);
            Assert.Equal(domownik.Nazwisko, returnedDomownik.Nazwisko);
            Assert.Equal(domownik.Email, returnedDomownik.Email);
            Assert.Equal(domownik.Telefon, returnedDomownik.Telefon);
            Assert.Equal(domownik.Nazwa_uzytkownika, returnedDomownik.Nazwa_uzytkownika);

            // Opcjonalnie, sprawdź, czy zwrócony URL jest poprawny
            Assert.Equal(nameof(DomownikController.GetDomownik), createdAtActionResult.ActionName);
            Assert.Equal(returnedDomownik.id_domownika, ((dynamic)createdAtActionResult.RouteValues["id"]));
        }

        [Fact]
        public void UpdateDomownik_UnknownId_ReturnsNotFoundResult()
        {
            // Arrange
            var controller = new DomownikController();
            var domownik = new Domownik { Imie = "Piotr", Nazwisko = "Wiśniewski" };

            // Act
            var result = controller.UpdateDomownik(1, domownik);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public void UpdateDomownik_ExistingId_ReturnsOkResult()
        {
            // Arrange
            var controller = new DomownikController();
            var domownik = new Domownik
            {
                Imie = "Maria",
                Nazwisko = "Kowalska",
                Email = "maria.kowalska@example.com",
                Telefon = "123456789",
                Nazwa_uzytkownika = "mkowalska"
            };
            controller.CreateDomownik(domownik);

            var updatedDomownik = new Domownik
            {
                Imie = "Maria",
                Nazwisko = "Nowak",
                Email = "maria.nowak@example.com",
                Telefon = "987654321",
                Nazwa_uzytkownika = "mnowak"
            };

            // Act
            var result = controller.UpdateDomownik(domownik.id_domownika, updatedDomownik);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var successResponse = Assert.IsType<SuccessResponse>(okResult.Value);
            Assert.Equal("Domownik updated successfully", successResponse.Message);
        }


        [Fact]
        public void DeleteDomownik_UnknownId_ReturnsNotFoundResult()
        {
            // Arrange
            var controller = new DomownikController();

            // Act
            var result = controller.DeleteDomownik(1);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public void DeleteDomownik_ExistingId_ReturnsNoContentResult()
        {
            // Arrange
            var controller = new DomownikController();
            var domownik = new Domownik { Imie = "Adam", Nazwisko = "Szymański" };
            controller.CreateDomownik(domownik);

            // Act
            var result = controller.DeleteDomownik(domownik.id_domownika);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}