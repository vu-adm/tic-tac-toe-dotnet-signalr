using System.Collections.Generic;
using System.Threading.Tasks;
using TicTacToe.Services.Models;

namespace TicTacToe.Services {
	public interface IGameHub {
		Task SendGameStartAsync(string opponent, GameModel game);
		Task SendGameUpdateAsync(string opponent, List<string[]> board);
		Task SendGameQuitAsync(string opponent);
	}
}
