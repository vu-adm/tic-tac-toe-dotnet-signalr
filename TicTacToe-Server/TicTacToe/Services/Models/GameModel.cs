using System;
using System.Collections.Generic;

namespace TicTacToe.Services.Models {
	public class GameModel {
		public string Id { get; set; }
		public List<string> Opponents { get; set; }
		public List<List<string>> Board { get; set; }
	}
}
