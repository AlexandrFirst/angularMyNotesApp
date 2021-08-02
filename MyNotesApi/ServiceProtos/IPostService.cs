using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyNotesApi.DTOs;

namespace MyNotesApi.ServiceProtos
{
    public interface IPostService
    {
        Task<bool> PostNote(string noteText, List<ImageDto> uploadImages, ImageDto titleImage);
        Task<bool> DeleteNote(int noteId);
        Task<NoteDto> GetNote(int noteId);
        Task<List<NoteDto>> GetNotes(int userId);
        Task<List<NoteDto>> GetNotes();
    }
}