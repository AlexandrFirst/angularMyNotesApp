using System.Linq;
using AutoMapper;
using MyNotesApi.DataContext;
using MyNotesApi.DTOs;

namespace MyNotesApi.Mapping
{
    public class NoteProfile : Profile
    {
        public NoteProfile()
        {
            CreateMap<Note, NoteDto>().ForMember(i => i.TitleImage, opt => opt.MapFrom(n => n.NoteImages.FirstOrDefault()));
        }
    }
}