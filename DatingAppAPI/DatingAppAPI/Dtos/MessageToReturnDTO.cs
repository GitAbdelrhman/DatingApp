using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAppAPI.Dtos
{
    public class MessageToReturnDTO
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderKnownAs { get; set; }
        public string SenderPhotoURL{ get; set; }
        public int RecipientId { get; set; }
        public string  RecipientKnownAs { get; set; }
        public string RecipientPhotoURL { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime? DateReaded { get; set; }
        public DateTime MessageSent { get; set; }
    }
}
