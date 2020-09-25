using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using TicTacToe.Services.Models;

namespace TicTacToe.Services {
	public class InMemoryGameServiceImpl : IGameService {
		private static readonly HashSet<string> _QUEUE = new HashSet<string>();
		private static readonly IDictionary<string, GameModel> _CURRENT_GAMES = new Dictionary<string, GameModel>();
		private readonly object _sync = new object();

		public GameModel SearchForOpponent(string username) {
			lock (_sync) {
				var opponent = _QUEUE.FirstOrDefault();
				if (string.IsNullOrEmpty(opponent))
					return null;
				if (opponent.Equals(username)) throw new Exception("Username already in queue");
				if (_CURRENT_GAMES.Values.Any(x => x.Opponents.Contains(username))) throw new Exception("User already playing game");
				var newGame = new GameModel {
								Id = Guid.NewGuid().ToString(),
								Opponents = new List<string> { username, opponent }
				};
				_CURRENT_GAMES.Add(newGame.Id, newGame);

				_QUEUE.Remove(opponent);

				return newGame;
			}
		}

		public GameModel GetGame(string id) {
			lock (_sync) {
				if (!_CURRENT_GAMES.TryGetValue(id, out var game)) return null;
				return game;
			}
		}

		public void AddToQueue(string username) => _QUEUE.Add(username);

		public void RemoveFromQueue(string username) => _QUEUE.Remove(username);

		public void UpdateBoard(string id, List<string[]> board) {
			lock (_sync) {
				if (!_CURRENT_GAMES.TryGetValue(id, out var game)) return;
				game.Board = board;
			}
		}

		public void DeleteGame(string id) {
			lock (_sync) {
				if (!_CURRENT_GAMES.TryGetValue(id, out _)) return;
				_CURRENT_GAMES.Remove(id);
			}
		}
	}
}
