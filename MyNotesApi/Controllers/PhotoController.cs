using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyNotesApi.DTOs;
using MyNotesApi.Helpers;
using MyNotesApi.Helpers.ExceptionHandler.CustomExceptions;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PhotoController : ControllerBase
    {
        private readonly IPhotoService photoService;

        public PhotoController(IPhotoService photoService)
        {
            this.photoService = photoService;
        }


        [HttpPost("upload/{isMain=false}")]
        public async Task<IActionResult> UploadPhoto([FromForm] IFormFile photo, bool isMain)
        {

            var result = await photoService.UploadPhoto(photo, isMain);

            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                throw new PhotoUploadException();
            }

        }

        [HttpDelete("delete/{photoPublicId}")]
        public async Task<IActionResult> deletePhoto(string photoPublicId)
        {
            try
            {
                var result = await photoService.DeletePhoto(photoPublicId);
                if (result == null)
                    throw new System.Exception();
            }
            catch
            {
                return BadRequest(new { Message = "Unable to delete the photo" });
            }
            return Ok(new { Message = "The photo is deleted" });
        }



        [HttpPost("deleteRange")]
        public async Task<IActionResult> deleteRangePhoto(ImageDeleteRangeDto imageIds)
        {
            var response = await photoService.DeleteRangePhoto(imageIds);

            return Ok(new
            {
                response
            });
        }
    }
}