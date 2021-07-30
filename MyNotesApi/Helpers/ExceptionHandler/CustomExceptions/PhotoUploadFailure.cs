using System;

namespace MyNotesApi.Helpers.ExceptionHandler.CustomExceptions
{
    public class PhotoUploadException:Exception
    {
        public PhotoUploadException():base("Unable to load photo"){}
    }
}