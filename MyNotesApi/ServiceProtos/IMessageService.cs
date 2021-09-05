using System.Threading.Tasks;
using MyNotesApi.DTOs;

namespace MyNotesApi.ServiceProtos
{
    public interface IMessageService
    {
         Task<MessageDto> SendMessage(int otherUserId, string message);
         Task<MessageDto> DeleteMessage(int messageId);
    }
}