using System.Collections.Generic;
using MyNotesApi.ServiceProtos;

namespace MyNotesApi.Services
{
    public class ActiveUserService: IActiveUserService
    {
        private List<string> ActiveUsers = new List<string>();

        public void AddUser(string userId)
        {
            if (!ExistsUser(userId))
            {
                ActiveUsers.Add(userId);
            }
        }

        public void RemoveUser(string userId)
        {
            ActiveUsers.Remove(userId);
        }

        public bool ExistsUser(string userId)
        {
            return ActiveUsers.Contains(userId);
        }

        public void PrintAllUsersNames()
        {
            foreach(var userId in ActiveUsers)
            {
                System.Console.WriteLine(userId);
            }
        }
    }
}