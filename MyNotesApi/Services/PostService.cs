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
            uploadImages.Add(titleImage);

            var urlPhotosToDelete = filterInputImgSrc(noteText, uploadImages.Select(i => i.ImgPath).ToList());
            var photoDtosToPost = uploadImages.FindAll(i => !urlPhotosToDelete.Exists(u => u == i.ImgPath));
            var photosToPost = dbContext.Images.Where(i => photoDtosToPost.Any(p => p.ImgPath == i.Url)).ToList();


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
                NoteImages = photosToPost,
                PublicationDate = DateTime.Now
            });

            await dbContext.SaveChangesAsync();

            return true;
        }
        public Task<bool> DeleteNote(int noteId)
        {
            throw new System.NotImplementedException();
        }

        public async Task<NoteDto> GetNote(int noteId)
        {
            var note_db = await dbContext.Notes.FirstOrDefaultAsync(n => n.NoteId == noteId);
            var note_dto = mapper.Map<NoteDto>(note_db);

            return note_dto;
        }
        
        public async Task<List<NoteDto>> GetNotes(int userId)
        {
            var userWithNotes = await dbContext.Users.Include(n => n.Notes).FirstOrDefaultAsync(u => u.Id == userId);
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
            foreach (HtmlNode img in nodes)
            {
                string imgSrc = img.GetAttributeValue("src", string.Empty);
                if (!string.IsNullOrEmpty(imgSrc))
                {
                    htmlContentImgs.Add(imgSrc);
                }
            }

            IEnumerable<string> urlsToDelete = from src in LoadedImages.Except(htmlContentImgs)
                                               select src;

            return urlsToDelete.ToList();

        }

       
    }
}