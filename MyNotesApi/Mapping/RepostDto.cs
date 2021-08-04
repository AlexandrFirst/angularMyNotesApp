using AutoMapper;
using MyNotesApi.DataContext;

namespace MyNotesApi.Mapping
{
    public class RepostDto:Profile
    {
        public RepostDto()
        {
            CreateMap<Repost, RepostDto>();
        }
    }
}