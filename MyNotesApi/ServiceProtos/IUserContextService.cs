using Microsoft.AspNetCore.Http;
using MyNotesApi.DTOs;

namespace MyNotesApi.ServiceProtos
{
    public interface IUserContextService
    {
        HttpUserContext GetUserContext();
    }
}