using System.Collections.Generic;
using MyNotesApi.DataContext;

namespace MyNotesApi.Models
{
    public class PhotoFilteringResult
    {
        public IEnumerable<string> UrlPhotosToDelete { get; set; }
        public IEnumerable<Image> PhotosToPost { get; set; }

    }
}