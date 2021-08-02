using System.Collections.Generic;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MyNotesApi.DataContext;
using MyNotesApi.DTOs;
using MyNotesApi.Helpers;
using MyNotesApi.Helpers.ExceptionHandler.CustomExceptions;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly CloudinaryHelper cloudinaryHelper;
        private readonly MyDataContext dbContext;

        private Cloudinary cloudinary { get; }
        public PhotoService(IOptions<CloudinaryHelper> cloudinaryHelper,
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

        public async Task<ImageDto> UploadPhoto(IFormFile photo, bool isMain)
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
                return null;
            }

            return new ImageDto()
            {
                ImagePublicId = uploadResults.PublicId,
                ImgPath = uploadResults.Url.ToString()
            };
        }

        public async Task<DeletionResult> DeletePhoto(string photoPublicId)
        {
            var deleteParams = new DeletionParams(photoPublicId);

            var result = await cloudinary.DestroyAsync(deleteParams);

            var image = await dbContext.Images.FirstOrDefaultAsync(i => i.PublicKey == photoPublicId);
            if (image != null)
                dbContext.Images.Remove(image);

            return result;
        }

        public async Task<List<DeleteRangePhotoResponse>> DeleteRangePhoto(ImageDeleteRangeDto imageIds)
        {
            List<DeleteRangePhotoResponse> response = new List<DeleteRangePhotoResponse>();

            foreach (var imageId in imageIds.ImageIds)
            {
                DeletionResult result = await DeletePhoto(imageId);
                response.Add(new DeleteRangePhotoResponse
                {
                    PhotoId = imageId,
                    Response = result.Result
                });
            }
            return response;
        }
    }
}