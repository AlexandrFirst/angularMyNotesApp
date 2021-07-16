using System;

namespace MyNotesApi.DataContext
{
    public class Like
    {
        public int LikeId { get; set; }
        public User User { get; set; }
        public Note Note { get; set; }
        public DateTime LikeDate { get; set; }
    }
}