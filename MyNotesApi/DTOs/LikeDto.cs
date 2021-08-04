using System;

namespace MyNotesApi.DTOs
{
    public class LikeDto
    {
        public UserPostDto User { get; set; }
        public NoteDto Note { get; set; }
        public DateTime LikeDate { get; set; }
    }
}