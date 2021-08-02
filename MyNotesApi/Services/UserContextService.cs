using Microsoft.AspNetCore.Http;
using MyNotesApi.DTOs;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.Services
{
    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor contextAccessor;
        private HttpUserContext _userContext;

        public UserContextService(IHttpContextAccessor accessor)
        {
            contextAccessor = accessor;
        }

        private HttpContext Context
        {
            get
            {
                return contextAccessor.HttpContext;
            }
        }

        public HttpUserContext GetUserContext()
        {
            return (HttpUserContext)Context.Items["User"];
        }
    }
}