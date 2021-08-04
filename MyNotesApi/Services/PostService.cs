using System.Collections.Generic;
using System.Threading.Tasks;
using MyNotesApi.DTOs;
using MyNotesApi.ServiceProtos;
using HtmlAgilityPack;
using System.Linq;
using MyNotesApi.DataContext;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using AutoMapper;
using MyNotesApi.Helpers.ExceptionHandler.CustomExceptions;

namespace MyNotesApi.Services
{
    public class PostService : IPostService
    {
        private readonly MyDataContext dbContext;
        private readonly IPhotoService photoService;
        private readonly IUserContextService userContext;
        private readonly IMapper mapper;

        public PostService(MyDataContext dbContext,
                            IPhotoService photoService,
                            IUserContextService userContext,
                            IMapper mapper)
        {
            this.dbContext = dbContext;
            this.photoService = photoService;
            this.userContext = userContext;
            this.mapper = mapper;
        }

        public async Task<bool> PostNote(string noteText, List<ImageDto> uploadImages, ImageDto titleImage)
        {
            if (titleImage != null)
                uploadImages.Add(titleImage);

            var urlPhotosToDelete = filterInputImgSrc(noteText, uploadImages.Where(i => !i.IsTitleImage).Select(i => i.ImageUrl).ToList());
            var photoDtosToPost = uploadImages.FindAll(i => !urlPhotosToDelete.Exists(u => u == i.ImageUrl));

            var photosToPost = dbContext.Images.ToList().Where(i => photoDtosToPost.Any(p => p.ImageUrl == i.Url));


            await photoService.DeleteRangePhoto(new ImageDeleteRangeDto()
            {
                ImageIds = urlPhotosToDelete
            });

            var contextUser = userContext.GetUserContext();
            var author = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == contextUser.Id);


            await dbContext.Notes.AddAsync(new Note()
            {
                Content = noteText,
                Author = author,
                NoteImages = photosToPost.ToList(),
                PublicationDate = DateTime.Now
            });

            await dbContext.SaveChangesAsync();

            return true;
        }


        public async Task<bool> DeleteNote(int noteId)
        {
            var noteToRemove = await dbContext.Notes.FirstOrDefaultAsync(n => n.NoteId == noteId);
            if (noteToRemove == null)
                throw new NoteNotFoundException(noteId);

            dbContext.Notes.Remove(noteToRemove);
            await dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<PostNoteDto> GetNote(int noteId)
        {
            var userId = userContext.GetUserContext().Id;

            var note_db = await dbContext.Notes.Include(i => i.NoteImages)
                                               .Include(u => u.Author)
                                               .FirstOrDefaultAsync(n => n.NoteId == noteId && n.Author.Id == userId);
            PostNoteDto note_dto = null;
            if (note_db != null)
                note_dto = new PostNoteDto()
                {
                    NoteText = note_db.Content,
                    TitleImage = mapper.Map<ImageDto>(note_db.NoteImages.FirstOrDefault(i => i.IsTitleImage))
                };

            return note_dto;
        }

        public async Task<List<NoteDto>> GetNotes(int userId)
        {
            var userWithNotes = await dbContext.Users.Where(u => u.Id == userId).Include(n => n.Notes)
                                                        .ThenInclude(p => p.NoteImages.Where(d => d.IsTitleImage)).FirstOrDefaultAsync();
            
            if(userWithNotes == null)
            {
                throw new UserNotFoundException();                
            }

            var notesDB = userWithNotes.Notes;

            var notesToReturn = mapper.Map<List<NoteDto>>(notesDB);

            return notesToReturn;

        }

        public async Task<List<NoteDto>> GetNotes()
        {
            return await GetNotes(userContext.GetUserContext().Id);
        }

        private List<string> filterInputImgSrc(string htmlContent, List<string> LoadedImages)
        {
            List<string> htmlContentImgs = new List<string>();

            HtmlDocument document = new HtmlDocument();
            document.LoadHtml(htmlContent);

            var nodes = document.DocumentNode.SelectNodes(@"//img[@src]");
            if (nodes != null)
            {
                foreach (HtmlNode img in nodes)
                {
                    string imgSrc = img.GetAttributeValue("src", string.Empty);

                    if (!string.IsNullOrEmpty(imgSrc))
                    {
                        htmlContentImgs.Add(imgSrc);
                    }
                }
            }

            IEnumerable<string> urlsToDelete = from src in LoadedImages.Except(htmlContentImgs)
                                               select src;

            return urlsToDelete.ToList();

        }


    }
}