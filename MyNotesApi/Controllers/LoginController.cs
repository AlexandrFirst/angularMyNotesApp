using Microsoft.AspNetCore.Mvc;

namespace MyNotesApi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class LoginController:ControllerBase
    {
        [HttpGet]
        public IActionResult GetUser(){
            return Ok("Hello");
        }
    }
}