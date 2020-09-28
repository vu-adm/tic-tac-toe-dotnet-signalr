<template>
	<div>
		<h1 id="tableLabel">
			Tic Tac Toe
			<span v-if="gameId">
				<span style="padding-left: 20%" v-if="moveValid && !isWinning">
					Your Move!
				</span>
				<span style="padding-left: 20%" v-if="!moveValid && !isWinning">
					Opponents turn...
				</span>
				<span style="padding-left: 20%" v-if="isWinning && isWinning == move">
					You won!!!
				</span>
				<span style="padding-left: 20%" v-if="isWinning && isWinning != move">
					You lost...
				</span>
			</span>
		</h1>
		<p v-if="!hasEnteredUsername">
			<label>Please enter your username</label>
			<input type="text" v-model="username" />
			<input
				type="button"
				@click="lookForOpponent(username)"
				value="Search for opponent"
			/>
		</p>
		<p v-if="hasEnteredUsername && opponent === ''">
			Searching for opponent...
		</p>
		<div v-if="gameId">
			<p>You're playing as {{ username }} ({{ move }})</p>
			<p>You're opponent is {{ opponent }}</p>
			<table>
				<tr>
					<td @click="setMove(0,0)" :style="getCharacterColor(0,0)">
						{{ board[0][0] }}
					</td>
					<td
						class="vert"
						@click="setMove(0,1)"
						:style="getCharacterColor(0,1)"
					>
						{{ board[0][1] }}
					</td>
					<td @click="setMove(0,2)" :style="getCharacterColor(0,2)">
						{{ board[0][2] }}
					</td>
				</tr>
				<tr>
					<td
						class="hori"
						@click="setMove(1,0)"
						:style="getCharacterColor(1,0)"
					>
						{{ board[1][0] }}
					</td>
					<td
						class="vert hori"
						@click="setMove(1,1)"
						:style="getCharacterColor(1,1)"
					>
						{{ board[1][1] }}
					</td>
					<td
						class="hori"
						@click="setMove(1,2)"
						:style="getCharacterColor(1,2)"
					>
						{{ board[1][2] }}
					</td>
				</tr>
				<tr>
					<td @click="setMove(2,0)" :style="getCharacterColor(2,0)">
						{{ board[2][0] }}
					</td>
					<td
						class="vert"
						@click="setMove(2,1)"
						:style="getCharacterColor(2,1)"
					>
						{{ board[2][1] }}
					</td>
					<td @click="setMove(2,2)" :style="getCharacterColor(2,2)">
						{{ board[2][2] }}
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
import ApiService from '@/services/apiServices.js';
import SignalRService from '@/services/signalRService.js';
export default {
	name: 'TicTacToe',
	data() {
		return {
			gameId: '',
			username: '',
			opponent: '',
			hasEnteredUsername: false,
			board: [],
			move: '',
		};
	},
	computed: {
		moveValid: function() {
			let xCount = 0,
				oCount = 0;
			for (let i = 0; i < this.board.length; i++) {
				let row = this.board[i];
				for (let j = 0; j < row.length; j++) {
					if (row[j] == 'X') xCount++;
					if (row[j] == 'O') oCount++;
				}
			}
			// x goes first
			if (oCount % 2 == 0 && xCount % 2 == 0 && this.move == 'X')
				return true;

			// o goes next
			if (oCount % 2 == 0 && xCount % 2 == 1 && this.move == 'O')
				return true;

			// then x goes again
			if (oCount % 2 == 1 && xCount % 2 == 1 && this.move == 'X')
				return true;

			// then x goes again
			if (oCount % 2 == 1 && xCount % 2 == 0 && this.move == 'O')
				return true;

			return false;
		},
		isWinning: function() {
			const winningGrid = [
				[
					{ r: 0, c: 0 },
					{ r: 0, c: 1 },
					{ r: 0, c: 2 },
				],
				[
					{ r: 1, c: 0 },
					{ r: 1, c: 1 },
					{ r: 1, c: 2 },
				],
				[
					{ r: 2, c: 0 },
					{ r: 2, c: 1 },
					{ r: 2, c: 2 },
				],
				[
					{ r: 0, c: 0 },
					{ r: 1, c: 0 },
					{ r: 2, c: 0 },
				],
				[
					{ r: 0, c: 1 },
					{ r: 1, c: 1 },
					{ r: 2, c: 1 },
				],
				[
					{ r: 0, c: 2 },
					{ r: 1, c: 2 },
					{ r: 2, c: 2 },
				],
				[
					{ r: 0, c: 0 },
					{ r: 1, c: 1 },
					{ r: 2, c: 2 },
				],
				[
					{ r: 0, c: 2 },
					{ r: 1, c: 1 },
					{ r: 2, c: 0 },
				],
			];
			let retval = null;
			for (let i = 0; i < winningGrid.length; i++) {
				let grid = winningGrid[i];
				let x = grid[0];
				const move = this.board[x.r][x.c];
				if (!move) continue;
				let y = grid[1];
				let z = grid[2];
				if (
					move === this.board[y.r][y.c] &&
					move === this.board[z.r][z.c]
				) {
					retval = move;
					break;
				}
			}
			return retval;
		}
	},
	methods: {
		async lookForOpponent() {
			try {
				this.hub.startConnection(this.username);
				const { data } = await this.api.lookForOpponent(this.username);
				if(!data){
					this.hub.listenForGameStart(this.startGameCallback);
				} else {
					this.startGameCallback(data, 'X');
				}
			} catch(err) {
				console.log(err);
			}
			this.hasEnteredUsername = true;
		},
		startGameCallback(game, move) {
			this.gameId = game.id;
			this.board = game.board;
			this.move = move;

			if(move == 'X')
				this.opponent = game.opponents[1];
			else
				this.opponent = game.opponents[0];

			this.listenForUpdate();
		},
		listenForUpdate(){
			this.hub.listenForUpdate((board) => {
				this.board = board;
			});
			this.hub.listenForQuit(() => {
				this.gameId = '';
				this.opponent = '';
				this.lookForOpponent(this.username);
			});
		},
		async setMove(i, j) {
			if(this.isWinning){
				if(this.isWinning == this.move) alert('You won!');
				else alert('You lost...');
				return;
			}
			if(!this.moveValid){
				alert('Not your move');
			} else if(this.board[i][j]) {
				alert('Position already taken');
			} else {
				this.board[i].splice(j, 1, this.move);
				await this.api.updateMove(this.username, this.gameId, this.board);
			}
		},
		async quitGame(){
			await this.api.quitGame(this.username, this.gameId);
		},
		getCharacterColor: function(i, j) {
			if (this.board[i][j] == 'X') return { color: 'red' };
			if (this.board[i][j] == 'O') return { color: 'blue' };
			return {};
		}
	},
	async created() {
		this.api = new ApiService().gameApi();
		this.hub = new SignalRService().hub();
		window.addEventListener('beforeunload', this.quitGame);
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
td {
	width: 100px;
	height: 100px;
	font-size: 50px;
	text-align: center;
}
table {
	margin: 5px auto;
}
.vert {
	border-left: 2px solid black;
	border-right: 2px solid black;
}
.hori {
	border-top: 2px solid black;
	border-bottom: 2px solid black;
}
</style>
