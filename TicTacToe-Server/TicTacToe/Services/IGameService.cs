using System.Collections.Generic;
using TicTacToe.Services.Models;

namespace TicTacToe.Services {
	public interface IGameService {
		GameModel SearchForOpponent(string username);
		GameModel GetGame(string id);
		void AddToQueue(string username);
		void RemoveFromQueue(string username);
		void UpdateBoard(string id, List<string[]> board);
		void DeleteGame(string id);
	}
}
