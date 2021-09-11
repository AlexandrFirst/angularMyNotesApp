namespace MyNotesApi.ServiceProtos
{
    public interface IActiveUserService
    {
        void AddUser(string userId);
        void RemoveUser(string userId);
        bool ExistsUser(string userId);
        void PrintAllUsersNames();

    }
}