using AutoMapper;
using MyNotesApi.DataContext;
using MyNotesApi.DTOs;

namespace MyNotesApi.Mapping
{
    public class ImageProfile : Profile
    {
        public ImageProfile()
        {
            CreateMap<Image, ImageDto>()
                .ForMember(im => im.ImagePublicId, opt => opt.MapFrom(dto => dto.PublicKey))
                .ForMember(im => im.ImgPath, opt => opt.MapFrom(dto => dto.Url));
        }
    }
}