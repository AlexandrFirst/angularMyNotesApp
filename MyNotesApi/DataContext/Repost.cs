using System;

namespace MyNotesApi.DataContext
{
    public class Repost
    {
        public int RepostId { get; set; }
        public User User { get; set; }
        public Note Note { get; set; }
        public DateTime RepostDate { get; set; }
    }
}