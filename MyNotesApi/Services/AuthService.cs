using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MyNotesApi.DataContext;
using MyNotesApi.DTOs;
using MyNotesApi.Helpers;
using MyNotesApi.Models;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppSettings appSettings;
        private readonly MyDataContext dbContext;

        public AuthService(IOptions<AppSettings> appSettings, MyDataContext dbContext)
        {
            this.appSettings = appSettings.Value;
            this.dbContext = dbContext;
        }

        public async Task<AuthResponse> Authenticate(AuthRequest model)
        {
            var user = await dbContext.Users
                                      .FirstOrDefaultAsync(u => u.Password == model.UserPassword && 
                                                                    u.Mail == model.UserMail);

            if(user == null)
                return null;

            var token = generateJwtToken(user);

            return new AuthResponse(){
                UserId = user.Id,
                UserMail = user.Mail,
                UserName = user.Name,
                UserToken = token
            };
        }

        public HttpUserContext GetUserContext(int userId)
        {
             var user = dbContext.Users
                                  .FirstOrDefault(u => u.Id == userId);
            
            if(user == null)
                return null;

            return new HttpUserContext(){
                Id = user.Id,
                Mail = user.Mail,
                Role = user.Role
            };
        }

        private string generateJwtToken(User user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] 
                {
                     new Claim("id", user.Id.ToString()),
                     new Claim(ClaimTypes.Role, "User")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        
    }
}