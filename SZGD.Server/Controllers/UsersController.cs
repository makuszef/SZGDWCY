using SZGD.Server.Models;

namespace SZGD.Server.Controllers;

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<Domownik> _userManager;

    public UsersController(UserManager<Domownik> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet("all")]
    public ActionResult<IEnumerable<Domownik>> GetAllUsers()
    {
        var users = _userManager.Users.ToList();
        return Ok(users);
    }
}
