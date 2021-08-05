using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyNotesApi.DTOs;
using MyNotesApi.Helpers;
using MyNotesApi.Helpers.ExceptionHandler.CustomExceptions;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostService postService;
        private readonly IUserContextService userContext;

        public PostController(IPostService postService,
                            IUserContextService userContext)
        {
            this.postService = postService;
            this.userContext = userContext;
        }


        [HttpPost("newPost")]
        public async Task<IActionResult> PostNote(PostNoteDto postNoteDto)
        {
            await postService.PostNote(postNoteDto.NoteText, postNoteDto.UploadImages, postNoteDto.TitleImage);
            return Ok(new
            {
                Message = "Your post in added successfully"
            });
        }

        [HttpGet("allNotes/{userId?}")]
        public async Task<IActionResult> GetMyNotes(int? userId)
        {

            List<NoteDto> response = new List<NoteDto>();
            if (userId == null)
            {
                response = await postService.GetNotes();
            }
            else
            {
                response = await postService.GetNotes(userId.Value);
            }

            if (response.Count == 0)
                throw new NoteDownloadException(userContext.GetUserContext().Mail);

            return Ok(response);
        }

        [HttpGet("note/{noteId}")]
        public async Task<IActionResult> GetNote(int noteId)
        {
            PostNoteDto note = await postService.GetNote(noteId);
            if (note == null)
            {
                throw new NoteNotFoundException(noteId);
            }

            return Ok(note);
        }



        [HttpPost("note/update/{noteId}")]
        public async Task<IActionResult> UpdateNote(int noteId, PostNoteDto postNoteDto)
        {
            await DeleteNote(noteId);
            await PostNote(postNoteDto);

            return Ok(new {
                Message = "The post is updated"
            });
        }

        [HttpDelete("note/{noteId}")]
        public async Task<IActionResult> DeleteNote(int noteId)
        {

            await postService.DeleteNote(noteId);

            return Ok(new
            {
                Message = "Done"
            });
        }
    }
}