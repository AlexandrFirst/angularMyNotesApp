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
using MyNotesApi.Extensions;
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
            PagedList<UserListInstance> UserListResponse = null;
            IEnumerable<User> response = null;

            if(searchParams.SearchPattern == null)
            {
                return Ok();
            }

            if (searchParams.IsSubscribed.HasValue)
            {
                int userId = userContext.GetUserContext().Id;
                var currentUser = await dbConext.Users.Include(m => m.Followers)
                                                            .ThenInclude(f => f.Followers)
                                                            .Include(s => s.Subscribers)
                                                            .Include(n => n.Notes)
                                                      .Include(m => m.Subscribers)
                                                            .ThenInclude(f => f.Followers)
                                                            .Include(s => s.Subscribers)
                                                            .Include(n => n.Notes)
                                                      .Where(u => u.Id == userId).FirstOrDefaultAsync();

                if (currentUser == null)
                {
                    throw new UserNotFoundException();
                }

                if (searchParams.IsSubscribed.Value)
                {
                    response = currentUser.Followers.Where(u => u.Name.Contains(searchParams.SearchPattern) || u.Mail.Contains(searchParams.SearchPattern));
                }
                else
                {
                    response = currentUser.Subscribers.Where(u => u.Name.Contains(searchParams.SearchPattern) || u.Mail.Contains(searchParams.SearchPattern));
                }
            }
            else
            {
                response = dbConext.Users.Include(u => u.Followers).Include(m => m.Subscribers).Include(n => n.Notes).Where(u => u.Name.ToLower().Contains(searchParams.SearchPattern.ToLower()) ||
                                                     u.Mail.Contains(searchParams.SearchPattern));
            }

            UserListResponse = UserlistToUserlistResponse(response, searchParams.PageNumber, searchParams.PageSize);

            // if (UserListResponse == null || UserListResponse.Count == 0)
            //     return new List<UserListInstance>();


            Response.AddPagination(UserListResponse.CurrentPage,
                                   UserListResponse.PageSize,
                                   UserListResponse.TotalCount,
                                   UserListResponse.TotalPages);

            return Ok(UserListResponse);
        }

        private PagedList<UserListInstance> UserlistToUserlistResponse(IEnumerable<User> response, int pageNumber, int pageSize)
        {
            var responseDto = mapper.Map<List<UserListInstance>>(response);

            return PagedList<UserListInstance>.CreateAsync(responseDto.AsQueryable(), pageNumber, pageSize);
        }
    }
}