namespace MyNotesApi.DTOs
{
    public class EditNoteDto
    {
        public int NoteId { get; set; }
        public string Content { get; set; }
        ImageDto TitleImage { get; set; }

    }
}