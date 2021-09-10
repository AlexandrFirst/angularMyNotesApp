using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using MyNotesApi.Helpers;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.HubConfig
{
    [Authorize]
    public class MyHub : Hub
    {
        private readonly IMessageService messageService;
        private readonly IUserContextService userContext;

        public MyHub(IMessageService messageService, IUserContextService userContext)
        {
            this.messageService = messageService;
            this.userContext = userContext;
        }

        public async override Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userContext.GetUserContext().Id.ToString());
            await base.OnConnectedAsync();
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userContext.GetUserContext().Id.ToString());
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessageToUser(int userId, string message)
        {
            await Clients.Group(userId.ToString()).SendAsync("RecieveMessage", message);
            await messageService.SendMessage(userId, message);
        }

        public async Task sendICECandiate(int userId, string iceCandidateData)
        {
            await Clients.Group(userId.ToString()).SendAsync("receiveICECandidate", iceCandidateData);
        }

        public async Task sendOffer(int userId, string offerData)
        {
            await Clients.Group(userId.ToString()).SendAsync("receiveOffer", offerData);
        }

        public async Task sendAnswer(int userId, string answer)
        {
            await Clients.Group(userId.ToString()).SendAsync("receiveAnswer", answer);
        }

        public async Task accessRequest(int toUserId)
        {
            await Clients.Group(toUserId.ToString()).SendAsync("reciveAccessRequest", toUserId);
        }

        public async Task accessResponse(int toUserId, bool canAccess)
        {
            await Clients.Group(toUserId.ToString()).SendAsync("reciveAccessResponse", new { fromUserId = toUserId, canAccess = canAccess });
        }

        public async Task declineCall(int userId)
        {
            await Clients.Group(userId.ToString()).SendAsync("declineCallRecieve");
        }

    }
}