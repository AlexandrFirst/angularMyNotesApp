using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyNotesApi.DataContext;
using MyNotesApi.DTOs;
using MyNotesApi.Extensions;
using MyNotesApi.Helpers;
using MyNotesApi.Models;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly MyDataContext dbConext;
        private readonly IUserContextService userContext;
        private readonly IMapper mapper;

        public MessageController(MyDataContext dbConext,
                                 IUserContextService userContext,
                                 IMapper mapper)
        {
            this.userContext = userContext;
            this.mapper = mapper;
            this.dbConext = dbConext;
        }

        [HttpGet("UserChatRooms")]
        public async Task<IActionResult> GetUserChatRooms([FromQuery] ChatSearchParams _params)
        {
            PagedList<ChatUserListInstance> ChatUserListResponse = null;

            var currentUserMessage = dbConext.Messages.Include(u => u.FromUser).Include(u => u.ToUser).Where(m => m.FromUser.Id == userContext.GetUserContext().Id ||
                                                        m.ToUser.Id == userContext.GetUserContext().Id);

            var users = await currentUserMessage.Select(u => new
            {
                otherUser = (u.FromUser.Id == userContext.GetUserContext().Id) ? u.ToUser : u.FromUser,
                currentUser = (u.FromUser.Id == userContext.GetUserContext().Id) ? u.FromUser : u.ToUser
            }).Where(o =>
                    o.currentUser.Name.ToLower().Contains(_params.SearchQuery.ToLower()) ||
                    o.currentUser.Mail.ToLower().Contains(_params.SearchQuery.ToLower()))
                .Select(h => h.otherUser).ToListAsync();


            var usersCasted = mapper.Map<List<ChatUserListInstance>>(users);

            ChatUserListResponse = PagedList<ChatUserListInstance>.CreateAsync(usersCasted.AsQueryable(), _params.PageNumber, _params.PageSize);

            Response.AddPagination(ChatUserListResponse.CurrentPage,
                                   ChatUserListResponse.PageSize,
                                   ChatUserListResponse.TotalCount,
                                   ChatUserListResponse.TotalPages);

            return Ok(ChatUserListResponse);
        }

        [HttpGet("UserChatRooms/{otherUserId}")]
        public async Task<IActionResult> GetUserChatRoom(int otherUserId, [FromQuery] ChatSearchParams _params)
        {
            int currentUserId = userContext.GetUserContext().Id;
            var sendMessages = await dbConext.Messages.Include(u => u.FromUser).Include(u => u.ToUser)
                                                .Where(m => m.FromUser.Id == currentUserId && m.ToUser.Id == otherUserId)
                                                .Select(m => new MessageDto{
                                                    MessageId = m.MessageId,
                                                    MessageText = m.MessageText,
                                                    SendTime = m.SendTime,
                                                    IsMyMessage = true
                                                })
                                                .ToListAsync();

            var receivedMessaged = await dbConext.Messages.Include(u => u.FromUser).Include(u => u.ToUser)
                                                .Where(m => m.ToUser.Id == currentUserId && m.FromUser.Id == otherUserId)
                                                .Select(m => new MessageDto{
                                                    MessageId = m.MessageId,
                                                    MessageText = m.MessageText,
                                                    SendTime = m.SendTime,
                                                    IsMyMessage = false
                                                })
                                                .ToListAsync();

            var response = sendMessages.Concat(receivedMessaged).OrderBy(m => m.SendTime);
            return Ok(response);
        }


    }
}