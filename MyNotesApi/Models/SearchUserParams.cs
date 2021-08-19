namespace MyNotesApi.Models
{
    public class SearchUserParams
    {
        public string SearchPattern { get; set; }
        public bool? IsSubscribed { get; set; }
    }
}