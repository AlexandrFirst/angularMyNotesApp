namespace MyNotesApi.DTOs
{
    public class UserListInstance
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string MainPhotoUrl { get; set; }
        public int FollowersCount { get; set; }
        public int SubscribersCount { get; set; }

    }
}