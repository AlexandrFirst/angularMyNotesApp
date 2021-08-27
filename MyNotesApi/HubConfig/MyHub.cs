using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using MyNotesApi.Helpers;

namespace MyNotesApi.HubConfig
{
    [Authorize]
    public class MyHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            Console.WriteLine("New user connected with id: " + Context.ConnectionId);
            return base.OnConnectedAsync();
        }
    }
}