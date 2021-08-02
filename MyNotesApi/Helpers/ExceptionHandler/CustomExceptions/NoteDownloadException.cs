using System;

namespace MyNotesApi.Helpers.ExceptionHandler.CustomExceptions
{
    public class NoteDownloadException : Exception
    {
        public NoteDownloadException(string mail) : base("No notes for " + mail + " are available")
        {

        }
    }
}