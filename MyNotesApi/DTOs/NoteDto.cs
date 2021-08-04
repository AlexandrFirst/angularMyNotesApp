using System;
using System.Collections.Generic;
using MyNotesApi.DataContext;

namespace MyNotesApi.DTOs
{
    public class NoteDto
    {
        public int NoteId { get; set; }
        public string Content { get; set; }
        public DateTime PublicationDate { get; set; }
        public UserPostDto Author { get; set; }
        public ImageDto TitleImage { get; set; }
        public ICollection<LikeDto> Likes { get; set; }
        public ICollection<RepostDto> Reposts { get; set; }
    }
}