using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using A2.Models;

namespace A2.Data
{
    

    public class A2Repo : IA2Repo
    {
        private readonly A2DBContext _dbContext;
        public A2Repo(A2DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Boolean AddUser(User user)
        {
            User existingUser = _dbContext.Users.FirstOrDefault(x => x.UserName == user.UserName);
            if (existingUser == null)
            {
                EntityEntry<User> e = _dbContext.Users.Add(user);
                User u = e.Entity;
                _dbContext.SaveChanges();
                return true;
            } else
            {
                return false;
            }
        }

        public bool ValidLogin(string userName, string password)
        {
            User c = _dbContext.Users.FirstOrDefault(e => e.UserName == userName && e.Password == password);
            if (c == null)
                return false;
            else
                return true;
        }

        public GameRecord FindEmptyGame()
        {
            GameRecord MatchedGame = _dbContext.GameRecords.FirstOrDefault(e => e.State == "wait");
            return MatchedGame;
        }

        public bool PlayerisWaiting(String MyUserName)
        {
            GameRecord MatchedGame = _dbContext.GameRecords.FirstOrDefault(e => e.State == "wait");
            if (MatchedGame == null)
            {
                return false;
            } else
            {
                return MatchedGame.Player1 == MyUserName;

            }

        }

        public GameRecord CreateGame(String MyPlayerUserName)
        {
            GameRecord myNewGame = new GameRecord { GameId = System.Guid.NewGuid().ToString(), State="wait", Player1=MyPlayerUserName, Player2=null, lastMovePlayer1=null, lastMovePlayer2=null};
            EntityEntry<GameRecord> e = _dbContext.GameRecords.Add(myNewGame);
            GameRecord g = e.Entity;
            _dbContext.SaveChanges();
            return g;
        }

        public GameRecord AddPlayer(String MyPlayerUserName)
        {
            GameRecord MyGame = _dbContext.GameRecords.FirstOrDefault(e => e.State == "wait");
            MyGame.Player2 = MyPlayerUserName;
            MyGame.State = "progress";
            _dbContext.SaveChanges();
            return MyGame;
        }

        public bool GameExists(String GameId)
        {
            GameRecord MyGame = _dbContext.GameRecords.FirstOrDefault(e => e.GameId == GameId);
            if (MyGame == null)
            {
                return false;
            } else
            {
                return true;
            }

        }

        public bool isMyGameId(String GameId, String UserName)
        {
            GameRecord MyGame = _dbContext.GameRecords.FirstOrDefault(e => e.GameId == GameId);
            if (MyGame.Player1 == UserName || MyGame.Player2 == UserName)
            {
                return true;
            } else
            {
                return false;
            }
        }

        public GameRecord GetGameById(String GameId)
        {
            GameRecord MyGame = _dbContext.GameRecords.FirstOrDefault(e => e.GameId == GameId);
            return MyGame;
        }

        public String GetMyOpponentsLastMove(String GameId, String UserName)
        {
            GameRecord MyGame = _dbContext.GameRecords.FirstOrDefault(e => e.GameId == GameId);
            if (MyGame.Player1 == UserName)
            {
                return MyGame.lastMovePlayer2;
            } else
            {
                return MyGame.lastMovePlayer1;
            }

        }

        public bool isMyTurn(String GameId, String myUserName)
        {
            GameRecord myGame = _dbContext.GameRecords.FirstOrDefault(e => e.GameId == GameId);
            if (myGame.Player1 == myUserName && myGame.lastMovePlayer1 == null || myGame.Player2 == myUserName && myGame.lastMovePlayer2 == null)
            {
                return true;
            } else
            {
                return false;
            }
        }

        public GameRecord MakeMove(String GameId, String myUserName, String myMove)
        {
            GameRecord myGame = _dbContext.GameRecords.FirstOrDefault(e => e.GameId == GameId);
            if (myGame.Player1 == myUserName)
            {
                myGame.lastMovePlayer1 = myMove;
                myGame.lastMovePlayer2 = null;
            } else
            {
                myGame.lastMovePlayer2 = myMove;
                myGame.lastMovePlayer1 = null;
            }
            _dbContext.SaveChanges();
            return myGame;
        }

        public bool hasGame(String UserName)
        {
            IEnumerable<GameRecord> AllGames = _dbContext.GameRecords.Select(e => e);
            foreach(GameRecord gameRecord in AllGames)
            {
                if (gameRecord.Player1 == UserName || gameRecord.Player2 == UserName)
                {
                    return true;
                }
            }
            return false;
        }

        public String gameOver(String gameId)
        {
            GameRecord MyGame = _dbContext.GameRecords.FirstOrDefault(e => e.GameId == gameId);
            _dbContext.GameRecords.Remove(MyGame);
            _dbContext.SaveChanges();
            return "game over";

        }
    }
}