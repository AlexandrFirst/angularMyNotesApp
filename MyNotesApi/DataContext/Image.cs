namespace MyNotesApi.DataContext
{
    public class Image
    {
        public int ImageId { get; set; }
        public Note Note { get; set; }
        public string Url { get; set; }
        public bool IsTitleImage { get; set; }
        public string PublicKey { get; set; }
    }
}