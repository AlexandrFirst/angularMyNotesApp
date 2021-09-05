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
using MyNotesApi.Models;
using MyNotesApi.Helpers;

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

        private PhotoFilteringResult filterUploadImages(List<ImageDto> uploadImages, string noteText)
        {
            var urlPhotosToDelete = filterInputImgSrc(noteText, uploadImages.Where(i => !i.IsTitleImage).Select(i => i.ImageUrl).ToList());
            var photoDtosToPost = uploadImages.FindAll(i => !urlPhotosToDelete.Exists(u => u == i.ImageUrl));

            var photosToPost = dbContext.Images.ToList().Where(i => photoDtosToPost.Any(p => p.ImageUrl == i.Url));

            return new PhotoFilteringResult()
            {
                PhotosToPost = photosToPost,
                UrlPhotosToDelete = urlPhotosToDelete
            };
        }

        public async Task PostNote(string noteText, List<ImageDto> uploadImages, ImageDto titleImage)
        {
            if (titleImage != null)
                uploadImages.Add(titleImage);

            PhotoFilteringResult filteringResult = filterUploadImages(uploadImages, noteText);

            var urlPhotosToDelete = filteringResult.UrlPhotosToDelete.ToList();

            var photosToPost = filteringResult.PhotosToPost;


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
        }

        public async Task UpdateNote(int noteId, string noteText, List<ImageDto> uploadImages, ImageDto titleImage)
        {
            if (titleImage != null)
                uploadImages.Add(titleImage);

            PhotoFilteringResult filteringResult = filterUploadImages(uploadImages, noteText);

            var urlPhotosToDelete = filteringResult.UrlPhotosToDelete.ToList();

            var photosToPost = filteringResult.PhotosToPost;


            await photoService.DeleteRangePhoto(new ImageDeleteRangeDto()
            {
                ImageIds = urlPhotosToDelete
            });

            var oldNote = await dbContext.Notes.FirstOrDefaultAsync(n => n.NoteId == noteId);

            oldNote.Content = noteText;
            oldNote.NoteImages = photosToPost.ToList();

            await dbContext.SaveChangesAsync();
        }

        public async Task<bool> DeleteNote(int noteId)
        {
            var noteToRemove = await dbContext.Notes.Include(u => u.Author).FirstOrDefaultAsync(n => n.NoteId == noteId);

            var userId = userContext.GetUserContext().Id;
            if (noteToRemove.Author.Id != userId)
                throw new UserNotFoundException();

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
                    TitleImage = mapper.Map<ImageDto>(note_db.NoteImages.FirstOrDefault(i => i.IsTitleImage)),
                    UploadImages = mapper.Map<List<ImageDto>>(note_db.NoteImages.Where(i => !i.IsTitleImage))
                };

            return note_dto;
        }

        public async Task<PagedList<NoteDto>> GetNotes(int userId, PageParams pageParams)
        {
            var userWithNotes = await dbContext.Users.Where(u => u.Id == userId).Include(n => n.Notes)
                                                        .ThenInclude(p => p.NoteImages.Where(d => d.IsTitleImage)).FirstOrDefaultAsync();
            
            if (userWithNotes == null)
            {
                throw new UserNotFoundException();
            }

            var notesDB = userWithNotes.Notes;

            var notesToReturn = mapper.Map<ICollection<NoteDto>>(notesDB);

            return PagedList<NoteDto>.CreateAsync(notesToReturn.AsQueryable(), pageParams.PageNumber, pageParams.PageSize);
            // return notesToReturn;

        }

        public async Task<PagedList<NoteDto>> GetNotes(PageParams pageParams)
        {
            return await GetNotes(userContext.GetUserContext().Id, pageParams);
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