using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MyNotesApi.DataContext;
using MyNotesApi.DTOs;
using MyNotesApi.Helpers;
using MyNotesApi.Helpers.ExceptionHandler.CustomExceptions;

namespace MyNotesApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PhotoController : ControllerBase
    {
        private readonly CloudinaryHelper cloudinaryHelper;
        private readonly MyDataContext dbContext;

        private Cloudinary cloudinary { get; }

        public PhotoController(IOptions<CloudinaryHelper> cloudinaryHelper,
                                MyDataContext dbContext)
        {
            this.cloudinaryHelper = cloudinaryHelper.Value;

            Account account = new Account(
                this.cloudinaryHelper.CloudName,
                this.cloudinaryHelper.APIKey,
                this.cloudinaryHelper.APISecret);

            cloudinary = new Cloudinary(account);
            cloudinary.Api.Secure = true;
            this.dbContext = dbContext;
        }


        [HttpPost("upload/{isMain=false}")]
        public async Task<IActionResult> UploadPhoto([FromForm] IFormFile photo, bool isMain)
        {
            var file = photo;

            var uploadResults = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                            .Width(500).Crop("fill")
                    };

                    uploadResults = await cloudinary.UploadAsync(uploadParams);

                    try
                    {
                        await dbContext.Images.AddAsync(new Image()
                        {
                            IsTitleImage = isMain,
                            PublicKey = uploadResults.PublicId,
                            Url = uploadResults.Url.ToString()
                        });

                        await dbContext.SaveChangesAsync();
                    }
                    catch
                    {
                        throw new PhotoUploadException();
                    }
                }
            }
            else
            {
                return BadRequest("Unable to read the file");
            }

            return Ok(new ImageDto()
            {
                ImagePublicId = uploadResults.PublicId,
                ImgPath = uploadResults.Url.ToString()
            });
        }

        [HttpDelete("delete/{photoPublicId}")]
        public async Task<IActionResult> deletePhoto(string photoPublicId)
        {
            try
            {
                var deleteParams = new DeletionParams(photoPublicId);

                var result = await cloudinary.DestroyAsync(deleteParams);
            }
            catch
            {
                return BadRequest(new { Message = "Unable to delete the photo" });
            }
            return Ok(new { Message = "The photo is deleted" });
        }
    }
}