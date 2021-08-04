using System;

namespace MyNotesApi.DTOs
{
    public class RepostDto
    {
        public UserPostDto User { get; set; }
        public NoteDto Note { get; set; }
        public DateTime RepostDate { get; set; }
    }
}