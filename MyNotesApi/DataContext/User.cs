using System.Collections.Generic;

namespace MyNotesApi.DataContext
{
    public class User
    {
        public User()
        {
            Notes = new HashSet<Note>();
            Likes = new HashSet<Like>();
            Reposts = new HashSet<Repost>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Mail { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string MainPhotoUrl { get; set; }
        public ICollection<User> Followers { get; set; }
        public ICollection<User> Subscribers { get; set; }
        public ICollection<Note> Notes { get; set; }
        public ICollection<Like> Likes { get; set; }
        public ICollection<Repost> Reposts { get; set; }
    }
}