using MyNotesApi.Helpers;

namespace MyNotesApi.Models
{
    public class ChatSearchParams : PageParams
    {
        public string SearchQuery { get; set; }
    }
}