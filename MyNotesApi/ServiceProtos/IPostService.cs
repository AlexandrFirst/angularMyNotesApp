using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyNotesApi.DTOs;
using MyNotesApi.Helpers;

namespace MyNotesApi.ServiceProtos
{
    public interface IPostService
    {
        Task PostNote(string noteText, List<ImageDto> uploadImages, ImageDto titleImage);
        Task UpdateNote(int noteId, string noteText, List<ImageDto> uploadImages, ImageDto titleImage);
        Task<bool> DeleteNote(int noteId);
        Task<PostNoteDto> GetNote(int noteId);
        Task<PagedList<NoteDto>> GetNotes(int userId, PageParams pageParams);
        Task<PagedList<NoteDto>> GetNotes(PageParams pageParams);
    }
}