using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using A2.Models;

namespace A2.Data
{
    public interface IA2Repo
    {
        public Boolean AddUser(User user);
        public bool ValidLogin(string userName, string password);
        public GameRecord FindEmptyGame();

        public GameRecord CreateGame(String myPlayerUserName);

        public GameRecord AddPlayer(String myPlayerUserName);

        public bool PlayerisWaiting(String myUserName);
        public bool GameExists(String GameId);
        public bool isMyGameId(String GameId, String UserName);

        public GameRecord GetGameById(String GameId);

        public String GetMyOpponentsLastMove(String GameId, String UserName);

        public bool isMyTurn(String GameId, String UserName);

        public GameRecord MakeMove(String GameId, String myUserName, String move);

        public bool hasGame(String UserName);

        public String gameOver(String gameId);

    }
}