using System;

namespace MyNotesApi.DataContext
{
    public class Message
    {
        public int MessageId { get; set; }
        public User FromUser { get; set; }
        public User ToUser { get; set; }
        public string MessageText { get; set; }
        public DateTime SendTime { get; set; }
    }
}