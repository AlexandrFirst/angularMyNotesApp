using AutoMapper;
using MyNotesApi.DataContext;
using MyNotesApi.DTOs;

namespace MyNotesApi.Mapping
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserRegister, User>();
        }
    }
}