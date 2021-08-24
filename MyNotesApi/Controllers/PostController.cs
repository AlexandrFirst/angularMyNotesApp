using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyNotesApi.DTOs;
using MyNotesApi.Helpers;
using MyNotesApi.Helpers.ExceptionHandler.CustomExceptions;
using MyNotesApi.ServiceProtos;
using MyNotesApi.Extensions;

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
        public async Task<IActionResult> GetMyNotes(int? userId, [FromQuery] PageParams pageParams)
        {

            PagedList<NoteDto> response;
            if (userId == null)
            {
                response = await postService.GetNotes(pageParams);
            }
            else
            {
                response = await postService.GetNotes(userId.Value, pageParams);
            }

            if (response == null || response.Count == 0)
            {
                if (userId.HasValue)
                    throw new NoteDownloadException("selected user");
                throw new NoteDownloadException(userContext.GetUserContext().Mail);

            }

            Response.AddPagination(response.CurrentPage,
                                   response.PageSize,
                                   response.TotalCount,
                                   response.TotalPages);

            return Ok(response as List<NoteDto>);
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
            // PostNoteDto note = await postService.GetNote(noteId);
            // await DeleteNote(noteId);
            // await PostNote(postNoteDto);

            await postService.UpdateNote(noteId, postNoteDto.NoteText, postNoteDto.UploadImages, postNoteDto.TitleImage);

            return Ok(new
            {
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