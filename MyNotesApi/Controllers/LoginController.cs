using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyNotesApi.Models;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IAuthService authService;

        public LoginController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate(AuthRequest model)
        {
            var response = await authService.Authenticate(model);

            if (response == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(response);
        }
    }
}