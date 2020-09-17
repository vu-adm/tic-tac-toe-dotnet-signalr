import { Component } from '@angular/core';
import { TicTacToeService } from '../services/tic-tac-toe.service';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent {
  public gameId: string;
  public username: string;
  public opponent: string;
  public hasEnteredUsername: boolean;
  public board: string[][];
  public move: string

  constructor(private ticTacToeService: TicTacToeService, public signalRService: SignalRService) {
    this.board = [
      [],
      [],
      []
    ];
  }

  public lookForOpponent(username: string) {
    this.signalRService.startConnection(username);
    this.ticTacToeService.startGame(this.username)
      .subscribe(data => {
        if(data == null) {
          this.signalRService.hubConnection.on("start-game", response => {
            this.gameId = response.id;
            this.opponent = response.opponents[0];
            this.move = 'O';
            this.listenForUpdate();
          });
        } else {
          this.gameId = data.id;
          this.opponent = data.opponents[1];
          this.move = 'X';
          this.listenForUpdate();
        }
      });
    this.hasEnteredUsername = true;
  }

  public listenForUpdate(){
    this.signalRService.hubConnection.on("update-game", response => {
      this.board = response;
    });
  }

  public setMove(i, j){
    let winner = this.isWinning();
    if(winner){
      if(winner == this.move) alert("You won!")
      else alert('You lost...')
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
    // check first row
    if(this.board[0][0] == 'X' && this.board[0][1] == 'X' && this.board[0][2] == "X") return 'X';
    if(this.board[0][0] == 'O' && this.board[0][1] == 'O' && this.board[0][2] == "O") return 'Y';

    // check second row
    if(this.board[1][0] == 'X' && this.board[1][1] == 'X' && this.board[1][2] == "X") return 'X';
    if(this.board[1][0] == 'O' && this.board[1][1] == 'O' && this.board[1][2] == "O") return 'Y';

    // check third row
    if(this.board[2][0] == 'X' && this.board[2][1] == 'X' && this.board[2][2] == "X") return 'X';
    if(this.board[2][0] == 'O' && this.board[2][1] == 'O' && this.board[2][2] == "O") return 'Y';

    // check first column
    if(this.board[0][0] == 'X' && this.board[1][0] == 'X' && this.board[2][0] == "X") return 'X';
    if(this.board[0][0] == 'O' && this.board[1][0] == 'O' && this.board[2][0] == "O") return 'Y';

    // check second column
    if(this.board[0][1] == 'X' && this.board[1][1] == 'X' && this.board[2][1] == "X") return 'X';
    if(this.board[0][1] == 'O' && this.board[1][1] == 'O' && this.board[2][1] == "O") return 'Y';

    // check 3rd column
    if(this.board[0][2] == 'X' && this.board[1][2] == 'X' && this.board[2][2] == "X") return 'X';
    if(this.board[0][2] == 'O' && this.board[1][2] == 'O' && this.board[2][2] == "O") return 'Y';

    // check diagonal column
    if(this.board[0][0] == 'X' && this.board[1][1] == 'X' && this.board[2][2] == "X") return 'X';
    if(this.board[0][2] == 'O' && this.board[1][1] == 'O' && this.board[2][2] == "O") return 'Y';

    // check other diagonal column
    if(this.board[0][2] == 'X' && this.board[1][1] == 'X' && this.board[0][2] == "X") return 'X';
    if(this.board[0][2] == 'O' && this.board[1][1] == 'O' && this.board[0][2] == "O") return 'Y';
    return null;
  }
}

