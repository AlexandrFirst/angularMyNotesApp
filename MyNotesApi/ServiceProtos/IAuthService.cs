using System.Threading.Tasks;
using MyNotesApi.DTOs;
using MyNotesApi.Models;

namespace MyNotesApi.ServiceProtos
{
    public interface IAuthService
    {
        Task<AuthResponse> Authenticate(AuthRequest model);
        HttpUserContext GetUserContext(int userId);
    }
}