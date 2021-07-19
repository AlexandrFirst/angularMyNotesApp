using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyNotesApi.DataContext;
using MyNotesApi.Helpers;

namespace MyNotesApi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MyDataContext dbConext;

        public UserController(MyDataContext dbConext)
        {
            this.dbConext = dbConext;
        }


        [HttpGet]
        [Authorize(Role="User")]
        public async Task<IActionResult> GetAllUsers()
        {
            List<User> users = new List<User>();

            await Task.Run(() =>
            {
                users = dbConext.Users.ToList();
            });

            return Ok(users);
        }
    }
}