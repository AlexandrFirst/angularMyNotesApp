using AutoMapper;
using MyNotesApi.DataContext;
using MyNotesApi.DTOs;

namespace MyNotesApi.Mapping
{
    public class MessageProfile : Profile
    {
        public MessageProfile()
        {
            CreateMap<Message, MessageDto>().ForMember(u => u.IsMyMessage, opt => opt.MapFrom(x => true));
        }
    }
}