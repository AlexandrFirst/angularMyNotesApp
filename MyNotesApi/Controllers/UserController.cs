using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyNotesApi.DataContext;
using MyNotesApi.DTOs;
using MyNotesApi.Helpers;
using MyNotesApi.Helpers.ExceptionHandler.CustomExceptions;

namespace MyNotesApi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MyDataContext dbConext;
        private readonly IMapper mapper;

        public UserController(MyDataContext dbConext, IMapper mapper)
        {
            this.dbConext = dbConext;
            this.mapper = mapper;
        }


        [HttpPost("registration")]
        public async Task<IActionResult> RegisterUser(UserRegister newUser)
        {
            User user = mapper.Map<User>(newUser);
            try
            {
                await dbConext.Users.AddAsync(user);
                await dbConext.SaveChangesAsync();
            }
            catch
            {
                throw new UserExistsException(newUser.Mail);
            }

            
            return Ok(new
            {
                Response = "success"
            });
        }
    }
}