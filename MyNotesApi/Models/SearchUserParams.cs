using MyNotesApi.Helpers;

namespace MyNotesApi.Models
{
    public class SearchUserParams : PageParams
    {
        public string SearchPattern { get; set; }
        public bool? IsSubscribed { get; set; }
    }
}