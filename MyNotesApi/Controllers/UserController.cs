using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyNotesApi.DataContext;
using MyNotesApi.DTOs;
using MyNotesApi.Helpers;
using MyNotesApi.Helpers.ExceptionHandler.CustomExceptions;
using MyNotesApi.Models;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MyDataContext dbConext;
        private readonly IMapper mapper;
        private readonly IUserContextService userContext;

        public UserController(
            MyDataContext dbConext,
            IMapper mapper,
            IUserContextService userContext)
        {
            this.dbConext = dbConext;
            this.mapper = mapper;
            this.userContext = userContext;
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


        [HttpGet("findUser")]
        public async Task<IActionResult> GetUsers([FromQuery] SearchUserParams searchParams)
        {
            List<UserListInstance> UserListResponse = new List<UserListInstance>();

            if (searchParams.IsSubscribed.HasValue)
            {
                int userId = userContext.GetUserContext().Id;
                var currentUser = await dbConext.Users.Include(m => m.Followers).Include(m => m.Subscribers).Where(u => u.Id == userId).FirstOrDefaultAsync();

                if (currentUser == null)
                {
                    throw new UserNotFoundException();
                }

                if (searchParams.IsSubscribed.Value)
                {
                    var response = currentUser.Followers.Where(u => u.Name.Contains(searchParams.SearchPattern) || u.Mail.Contains(searchParams.SearchPattern));
                    UserListResponse = mapper.Map<List<UserListInstance>>(response);
                }
                else
                {
                    var response = currentUser.Subscribers.Where(u => u.Name.Contains(searchParams.SearchPattern) || u.Mail.Contains(searchParams.SearchPattern));
                    UserListResponse = mapper.Map<List<UserListInstance>>(response);
                }
            }
            else
            {
                var response = dbConext.Users.Where(u => u.Name.Contains(searchParams.SearchPattern) || u.Mail.Contains(searchParams.SearchPattern));
                UserListResponse = mapper.Map<List<UserListInstance>>(response);
            }
            if (UserListResponse.Count == 0)
                throw new Exception("No users found");

            return Ok(UserListResponse);
        }
    }
}