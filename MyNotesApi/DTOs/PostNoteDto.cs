using System.Collections.Generic;

namespace MyNotesApi.DTOs
{
    public class PostNoteDto
    {
        public string NoteText { get; set; }
        public List<ImageDto> UploadImages { get; set; }
        public ImageDto TitleImage { get; set; }
    }
}