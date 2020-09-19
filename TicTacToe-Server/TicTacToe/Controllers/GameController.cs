using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TicTacToe.Services;

namespace TicTacToe.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class GameController : ControllerBase {
		private readonly IGameHub _gameHub;
		private readonly IGameService _gameSvc;

		public GameController(IGameHub gameHub, IGameService gameSvc) {
			_gameHub = gameHub;
			_gameSvc = gameSvc;
		}

		[HttpGet("test/{username}")]
		public IActionResult Test(string username) {
			return Ok(new {opponent = username, gameId = username});
		}

		[HttpGet("start/{username}")]
		public async Task<IActionResult> StartGame(string username) {
			try {
				var game = _gameSvc.SearchForOpponent(username);
				if (game == null) {
					_gameSvc.AddToQueue(username);
					return Ok();
				}

				var opponent = game.Opponents.First(x => x != username);
				await _gameHub.SendGameStartAsync(opponent, game);
				return Ok(game);
			} catch (Exception ex) {
				return StatusCode(500, ex.Message);
			}
		}

		[HttpPut("move/{username}/{gameId}")]
		public async Task<IActionResult> UpdateMove(string username, string gameId, [FromBody] List<string[]> board) {
			try {
				var game = _gameSvc.GetGame(gameId);
				_gameSvc.UpdateBoard(game.Id, board);
				var opponent = game.Opponents.First(x => x != username);
				await _gameHub.SendGameUpdateAsync(opponent, board);
				return Accepted();
			} catch (Exception ex) {
				return StatusCode(500, ex.Message);
			}
		}

		[HttpPost("quit/{username}/{gameId}")]
		public async Task<IActionResult> QuitGame(string username, string gameId) {
			try {
				_gameSvc.RemoveFromQueue(username);
				var game = _gameSvc.GetGame(gameId);
				if (game == null) return Accepted();
				_gameSvc.DeleteGame(game.Id);
				var opponent = game.Opponents.First(x => x != username);
				await _gameHub.SendGameQuitAsync(opponent);
				return Accepted();
			} catch (Exception ex) {
				return StatusCode(500, ex.Message);
			}
		}
	}
}
