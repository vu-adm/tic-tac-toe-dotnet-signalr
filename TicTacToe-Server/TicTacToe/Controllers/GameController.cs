using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TicTacToe.Services;

namespace TicTacToe.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class GameController : ControllerBase {
		private readonly IHubContext<GameHub> _gameHub;
		private readonly IGameService _gameSvc;

		public GameController(IHubContext<GameHub> gameHub, IGameService gameSvc) {
			_gameHub = gameHub;
			_gameSvc = gameSvc;
		}

		[HttpGet("test/{username}")]
		public IActionResult Test(string username) {
			return Ok(new {opponent = username, gameId = username});
		}

		[HttpGet("start/{username}")]
		public IActionResult StartGame(string username) {
			try {
				var game = _gameSvc.SearchForOpponent(username);
				if (game == null) {
					_gameSvc.AddToQueue(username);
					return Ok();
				}

				var opponent = game.Opponents.First(x => x != username);
				_gameHub.Clients.User(opponent).SendAsync("start-game", game);
				return Ok(game);
			} catch (Exception ex) {
				return StatusCode(500, ex.Message);
			}
		}

		[HttpPut("move/{username}/{gameId}")]
		public IActionResult UpdateMove(string username, string gameId, [FromBody] List<List<string>> board) {
			try {
				var game = _gameSvc.GetGame(gameId);
				_gameSvc.UpdateBoard(game.Id, board);
				var opponent = game.Opponents.First(x => x != username);
				_gameHub.Clients.User(opponent).SendAsync("update-game", board);
				return Accepted();
			} catch (Exception ex) {
				return StatusCode(500, ex.Message);
			}
		}

		[HttpPost("quit/{username}/{gameId}")]
		public IActionResult QuitGame(string username, string gameId) {
			try {
				var game = _gameSvc.GetGame(gameId);
				if (!string.IsNullOrEmpty(game.IsWinning())) {
					_gameSvc.DeleteGame(game.Id);
				}
				var opponent = game.Opponents.First(x => x != username);
				_gameHub.Clients.User(opponent).SendAsync("update-game", board);
				return Accepted();
			} catch (Exception ex) {
				return StatusCode(500, ex.Message);
			}
		}
	}
}
