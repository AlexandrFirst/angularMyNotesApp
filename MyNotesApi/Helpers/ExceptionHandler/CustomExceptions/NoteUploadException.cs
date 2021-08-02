using System;

namespace MyNotesApi.Helpers.ExceptionHandler.CustomExceptions
{
    public class NoteUploadException : Exception
    {
        public NoteUploadException() : base("Unable to upload your post")
        {

        }
    }
}