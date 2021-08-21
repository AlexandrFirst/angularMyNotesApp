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
            CreateMap<User, UserPostDto>();
            CreateMap<User, UserListInstance>()
                .ForMember(u => u.FollowersCount, opt => opt.MapFrom(m => m.Followers.Count))
                .ForMember(u => u.SubscribersCount, opt => opt.MapFrom(m => m.Subscribers.Count))
                .ForMember(n => n.PostCount, opt => opt.MapFrom(m => m.Notes.Count));
        }
    }
}