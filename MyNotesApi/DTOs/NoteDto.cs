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
        public User Author { get; set; }
        public ICollection<Image> NoteImages { get; set; }
        public ICollection<Like> Likes { get; set; }
        public ICollection<Repost> Reposts { get; set; }
    }
}