using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace A2.Dtos
{
    public class GameRecordOut
    {
        public String GameId { get; set; }
        public String State { get; set; }
        public String Player1 { get; set; }
        public String Player2 { get; set; }
        public String lastMovePlayer1 { get; set; }
        public String lastMovePlayer2 { get; set; }
    }
}