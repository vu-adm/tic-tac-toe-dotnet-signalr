using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TicTacToe.Services.Models;

namespace TicTacToe.Services {
	public class GameHub : Hub, IGameHub {
		private readonly IHubClients _client;

		public GameHub(IHubContext<GameHub> hub) {
			_client = hub.Clients;
		}

		public Task SendGameStartAsync(string opponent, GameModel game) => _client.User(opponent).SendAsync("start-game", game);

		public Task SendGameUpdateAsync(string opponent, List<string[]> board) => _client.User(opponent).SendAsync("update-game", board);

		public Task SendGameQuitAsync(string opponent) => _client.User(opponent).SendAsync("quit-game");
	}
}
