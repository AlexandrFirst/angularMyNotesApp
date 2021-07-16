using System;
using System.Collections.Generic;

namespace MyNotesApi.DataContext
{
    public class Note
    {
        public Note()
        {
            NoteImages = new HashSet<Image>();
            Likes = new HashSet<Like>();
            Reposts = new HashSet<Repost>();
        }

        public int NoteId { get; set; }
        public string Content { get; set; }
        public DateTime PublicationDate { get; set; }
        public User Author { get; set; }
        public ICollection<Image> NoteImages { get; set; }
        public ICollection<Like> Likes { get; set; }
        public ICollection<Repost> Reposts { get; set; }
    }
}