using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using A2.Models;
using A2.Data;
using A2.Dtos;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace A2.Controllers
{
    [Route("api")]
    [ApiController]
    public class A2Controller : Controller
    {
        private readonly IA2Repo _repository;

        public A2Controller(IA2Repo repository)
        {
            _repository = repository;
        }

        [HttpPost("Register")]
        public ActionResult<String> AddUser(User user)
        {
            User c = new User
            {
                UserName = user.UserName,
                Password = user.Password,
                Address = user.Address
            };
            Boolean UserIsAdded = _repository.AddUser(c);
            if (UserIsAdded)
            {
                return Ok("User successfully registered.");
            } else
            {
                return Ok("Username not available.");
            }

        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("GetVersionA")]
        public ActionResult<String> GetVersionA()
        {
            
            return Ok("1.0.0 (auth)");
        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("PurchaseItem/{id}")]
        public ActionResult<Order> PurchaseItem(Int64 id)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string myUserName = c.Value;

            Order order = new Order {productId = id,  userName = myUserName};
            return Ok(order);
        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("PairMe")]
        public ActionResult<GameRecordOut> PairMe()
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string myUserName = c.Value;
            GameRecord MyGame = _repository.FindEmptyGame();

            GameRecord newGame = new GameRecord();

            if (_repository.PlayerisWaiting(myUserName))
            {
                newGame = MyGame;
            } else if (MyGame == null)
            {
                newGame = _repository.CreateGame(myUserName);
            } else
            {
                newGame = _repository.AddPlayer(myUserName);
            }

            GameRecordOut GameOutput = new GameRecordOut {GameId = newGame.GameId, State = newGame.State, Player1 = newGame.Player1, Player2 = newGame.Player2, lastMovePlayer1 = newGame.lastMovePlayer1, lastMovePlayer2 = newGame.lastMovePlayer2};
            return Ok(GameOutput);
        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("TheirMove/{gameId}")]
        public ActionResult<String> TheirMove(string gameId)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string myUserName = c.Value;
            if (!_repository.GameExists(gameId))
            {
                return Ok("no such gameId");
            } 
            else if (!_repository.isMyGameId(gameId, myUserName))
            {
                return Ok("not your game id");
            }
            else if (_repository.PlayerisWaiting(myUserName))
            {
                return Ok("You do not have an opponent yet.");
            } 
            else
            {
                String OpponentsLastMove = _repository.GetMyOpponentsLastMove(gameId, myUserName);
                if (OpponentsLastMove == null)
                {
                    return Ok("Your opponent has not moved yet.");
                }
                return Ok(OpponentsLastMove);
            }

        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpPost("MyMove")]
        public ActionResult<String> MyMove(GameMove g)
        {
            //GameMove g = new GameMove{gameId = myGameMove.gameId, move = myGameMove.move};
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string myUserName = c.Value;
            if (!_repository.GameExists(g.gameId))
            {
                return Ok("no such gameId");
            }
            else if (!_repository.isMyGameId(g.gameId, myUserName))
            {
                return Ok("not your game id");
            } else if (_repository.PlayerisWaiting(myUserName))
            {
                return Ok("You do not have an opponent yet.");
            } else if (!_repository.isMyTurn(g.gameId, myUserName))
            {
                return Ok("It is not your turn.");
            } else
            {
                _repository.MakeMove(g.gameId, myUserName, g.move);
                return Ok("move registered");
            }
        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("QuitGame/{gameId}")]
        public ActionResult<String> QuitGame(String gameId)
        {
            ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
            Claim c = ci.FindFirst("userName");
            string myUserName = c.Value;
            if (!_repository.hasGame(myUserName))
            {
                return Ok("You have not started a game.");
            }
            else if (!_repository.GameExists(gameId))
            {
                return Ok("no such gameId");
            }
            else if (!_repository.isMyGameId(gameId, myUserName))
            {
                return Ok("not your game id");
            }
            else
            {
                _repository.gameOver(gameId);
                return Ok("game over");
            }

        }

    }

}