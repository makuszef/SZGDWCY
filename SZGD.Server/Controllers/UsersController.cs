namespace SZGD.Server.Controllers;

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;

    public UsersController(UserManager<IdentityUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet("all")]
    public ActionResult<IEnumerable<IdentityUser>> GetAllUsers()
    {
        var users = _userManager.Users.ToList();
        return Ok(users);
    }
}
