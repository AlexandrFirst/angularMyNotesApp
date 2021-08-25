using System;

namespace MyNotesApi.DTOs
{
    public class MessageDto
    {
        public int MessageId { get; set; }
        public string MessageText { get; set; }
        public DateTime SendTime { get; set; }
        public bool IsMyMessage { get; set; }
    }
}