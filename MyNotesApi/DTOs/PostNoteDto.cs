using System.Collections.Generic;

namespace MyNotesApi.DTOs
{
    public class PostNoteDto
    {
        public string noteText { get; set; }
        public List<ImageDto> uploadImages { get; set; }
        public ImageDto titleImage { get; set; }
    }
}