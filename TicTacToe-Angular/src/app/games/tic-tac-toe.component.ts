import { Component, HostListener, OnDestroy } from '@angular/core';
import { TicTacToeService } from '../services/tic-tac-toe.service';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnDestroy {
  public gameId: string;
  public username: string;
  public opponent: string;
  public hasEnteredUsername: boolean;
  public board: string[][];
  public move: string

  constructor(private ticTacToeService: TicTacToeService, public signalRService: SignalRService) {  
    this.board = [[]];
  }

  public lookForOpponent(username: string) {
    this.signalRService.startConnection(username);
    this.ticTacToeService.startGame(this.username)
      .subscribe(data => {
        if(data == null) {
          this.signalRService.hubConnection.on("start-game", response => {
            this.gameId = response.id;
            this.opponent = response.opponents[0];
            this.board = response.board;
            this.move = 'O';
            this.listenForUpdate();
          });
        } else {
          this.gameId = data.id;
          this.opponent = data.opponents[1];
          this.move = 'X';
          this.board = data.board;
          this.listenForUpdate();
        }
      });
    this.hasEnteredUsername = true;
  }

  public listenForUpdate(){
    this.signalRService.hubConnection.on("update-game", response => {
      this.board = response;
    });
    this.signalRService.hubConnection.on('quit-game', _ => { 
      this.gameId = null;
      this.opponent = null;
      this.lookForOpponent(this.username);
    });
  }

  public setMove(i: number, j: number){
    let winner = this.isWinning();
    if(winner){
      if(winner == this.move) alert("You won!");
      else alert('You lost...');
      return;
    }
    if(!this.moveValid()){
      alert('Not your move');
    } else if(this.board[i][j]) {
      alert('Position already taken');
    } else {
      this.board[i][j] = this.move;
      this.ticTacToeService.updateMove(this.username, this.gameId, this.board).subscribe();
    }
  }

  public moveValid() : boolean{
    let xCount=0, oCount=0;
    for(let i =0; i<this.board.length; i++){
      let row = this.board[i];
      for(let j =0; j<row.length; j++){
        if(row[j] == 'X') xCount++;
        if(row[j] == 'O') oCount++;
      }
    }
    // x goes first
    if(oCount%2 == 0 && xCount%2 == 0 && this.move == 'X') return true;

    // o goes next
    if(oCount%2 == 0 && xCount%2 == 1 && this.move == 'O') return true;

    // then x goes again
    if(oCount%2 == 1 && xCount%2 == 1 && this.move == 'X') return true;

    // then x goes again
    if(oCount%2 == 1 && xCount%2 == 0 && this.move == 'O') return true;

    return false;
  }

  public getCharacterColor(i: number, j: number) : object {
    if(this.board[i][j] == 'X') return { color: "red" }
    if(this.board[i][j] == 'O') return { color: "blue" }
    return {};
  }

  public isWinning(): string{
    const winningGrid = [
      [{r: 0, c: 0}, {r: 0, c: 1}, {r: 0, c: 2}],
      [{r: 1, c: 0}, {r: 1, c: 1}, {r: 1, c: 2}],
      [{r: 2, c: 0}, {r: 2, c: 1}, {r: 2, c: 2}],
      [{r: 0, c: 0}, {r: 1, c: 0}, {r: 2, c: 0}],
      [{r: 0, c: 1}, {r: 1, c: 1}, {r: 2, c: 1}],
      [{r: 0, c: 2}, {r: 1, c: 2}, {r: 2, c: 2}],
      [{r: 0, c: 0}, {r: 1, c: 1}, {r: 2, c: 2}],
      [{r: 0, c: 2}, {r: 1, c: 1}, {r: 2, c: 0}]
    ]
    let retval = null;
    for(let i=0; i<winningGrid.length; i++){
      let grid = winningGrid[i];
      let x = grid[0];
      const move = this.board[x.r][x.c];
      if(!move) continue;
      let y = grid[1];
      let z = grid[2];
      if(move === this.board[y.r][y.c] && move === this.board[z.r][z.c]){
        retval = move;
        break;
      }
    }
    return retval;
  }

  ngOnDestroy(){
    this.handleDestroy();
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(_) {
    this.handleDestroy();
  }

  handleDestroy(){
      this.ticTacToeService.quit(this.username, this.gameId).subscribe();
  }
}