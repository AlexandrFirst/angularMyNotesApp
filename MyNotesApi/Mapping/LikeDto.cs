using AutoMapper;
using MyNotesApi.DataContext;

namespace MyNotesApi.Mapping
{
    public class LikeDto : Profile
    {
        public LikeDto()
        {
            CreateMap<Like, LikeDto>();
        }
    }
}