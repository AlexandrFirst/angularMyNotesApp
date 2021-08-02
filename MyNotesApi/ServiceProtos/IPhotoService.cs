using System.Collections.Generic;
using System.Threading.Tasks;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using MyNotesApi.DTOs;

namespace MyNotesApi.ServiceProtos
{
    public interface IPhotoService
    {
         Task<ImageDto> UploadPhoto(IFormFile photo, bool isMain);
         Task<DeletionResult> DeletePhoto(string photoPublicId);
         Task<List<DeleteRangePhotoResponse>> DeleteRangePhoto (ImageDeleteRangeDto imageIds);
    }
}