﻿using System;
using System.Collections.Generic;

namespace TicTacToe.Services.Models {
	public class GameModel {
		public string Id { get; set; }
		public List<string> Opponents { get; set; }
		public List<List<string>> Board { get; set; }

		internal string IsWinning() {
			var winningGrid = new List<List<(int r, int c)>> {
							new List<(int r, int c)> {(0, 0), (0, 1), (0, 2)},
							new List<(int r, int c)> {(0, 0), (0, 1), (0, 2)},
							new List<(int r, int c)> {(0, 0), (0, 1), (0, 2)},
							new List<(int r, int c)> {(0, 0), (0, 1), (0, 2)},
							new List<(int r, int c)> {(0, 0), (0, 1), (0, 2)},
							new List<(int r, int c)> {(0, 0), (0, 1), (0, 2)},
							new List<(int r, int c)> {(0, 0), (0, 1), (0, 2)},
							new List<(int r, int c)> {(0, 0), (0, 1), (0, 2)}
			};

			string retval = null;
			for (var i = 0; i < winningGrid.Count; i++) {
				var grid = winningGrid[i];
				var x = grid[0];
				var move = Board[x.r][x.c];
				if (string.IsNullOrEmpty(move)) continue;
				var y = grid[1];
				var z = grid[2];
				if (move == Board[y.r][y.c] && move == Board[z.r][z.c]) {
					retval = move;
					break;
				}
			}
			return retval;
		}
	}
}
