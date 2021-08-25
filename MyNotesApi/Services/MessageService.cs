using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyNotesApi.DataContext;
using MyNotesApi.DTOs;
using MyNotesApi.Helpers.ExceptionHandler.CustomExceptions;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.Services
{
    public class MessageService : IMessageService
    {
        private readonly IUserContextService userContext;
        private readonly MyDataContext dbContext;
        private readonly IMapper mapper;

        public MessageService(MyDataContext dbContext,
                              IUserContextService userContext,
                              IMapper mapper)
        {
            this.mapper = mapper;
            this.userContext = userContext;
            this.dbContext = dbContext;
        }

        public async Task<MessageDto> DeleteMessage(int messageId)
        {
            throw new System.NotImplementedException();
        }

        public async Task<MessageDto> SendMessage(int otherUserId, string message)
        {
            var fromUser = await dbContext.Users.Where(u => u.Id == userContext.GetUserContext().Id).FirstOrDefaultAsync();
            var toUser = await dbContext.Users.Where(u => u.Id == otherUserId).FirstOrDefaultAsync();

            if (fromUser == null || toUser == null)
                throw new UserNotFoundException();

            var newMessage = new Message()
            {
                FromUser = fromUser,
                ToUser = toUser,
                MessageText = message,
                SendTime = DateTime.Now
            };

            await dbContext.Messages.AddAsync(newMessage);
            await dbContext.SaveChangesAsync();

            var messageToReturn = mapper.Map<MessageDto>(newMessage);


            return messageToReturn;
        }
    }
}