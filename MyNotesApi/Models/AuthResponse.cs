namespace MyNotesApi.Models
{
    public class AuthResponse
    {
        public int UserId { get; set; }
        public string UserToken { get; set; }
        public string UserMail { get; set; }
        public string UserName { get; set; }
    }
}