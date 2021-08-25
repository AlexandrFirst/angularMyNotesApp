using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using MyNotesApi.Helpers;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.MyHub
{
    [Authorize]
    public class MyHub : Hub
    {
        private readonly IMessageService messageService;
        private readonly IUserContextService userContext;

        public MyHub(IMessageService messageService,
                    IUserContextService userContext)
        {
            this.messageService = messageService;
            this.userContext = userContext;
        }

        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userContext.GetUserContext().Id.ToString());

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userContext.GetUserContext().Id.ToString());

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(int toUserId, string message)
        {
            var newMessage = await messageService.SendMessage(toUserId, message);

            await Clients.Caller.SendAsync("GetOwnMessage", newMessage);
            await Clients.Group(toUserId.ToString()).SendAsync("GetMessage", newMessage);
        }
    }
}