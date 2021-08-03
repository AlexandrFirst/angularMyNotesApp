using System;

namespace MyNotesApi.Helpers.ExceptionHandler.CustomExceptions
{
    public class NoteNotFoundException:Exception
    {
        public NoteNotFoundException(int noteId):base("Can't find note with id: " + noteId)
        {
            
        }
    }
}