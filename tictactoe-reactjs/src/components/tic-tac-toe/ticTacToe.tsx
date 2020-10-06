import React from 'react';
import './ticTacToe.css';
import { TicTacToeService } from '../../services/tic-tac-toe.service';
import { SignalRService } from '../../services/signal-r.service'


export class TicTacToe extends React.Component {
    private api: TicTacToeService;
    private hub: SignalRService;
    state = {
        username: '',
        hasEnteredUsername: false,
        gameId: '',
        board: [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ],
        move: '',
        opponent: ''
    };

    constructor(props: {}) {
        super(props);
        this.api = new TicTacToeService();
        this.hub = new SignalRService();
    }

    lookForOpponent = async () => {
        try {
            this.hub.startConnection(this.state.username);
            const { data } = await this.api.startGame(this.state.username);
            if(!data){
                this.hub.listenForGameStart(this.startGameCallback);
            } else {
                this.startGameCallback(data, 'X');
            }
            this.setState({
                hasEnteredUsername: true
            });
        } catch(err) {
            console.log(err);
        }
    }

    startGameCallback = (game: any, move: string) => {
        this.setState({
            gameId: game.id,
            board: game.board,
            move: move
        });

        if(move == 'X')
            this.setState({
                opponent: game.opponents[1]
            });
        else
            this.setState({
                opponent: game.opponents[0]
            });

        this.listenForUpdate();
    }

    listenForUpdate(){
        this.hub.listenForUpdate((board: []) => {
            this.setState({
                board: board
            });
        });
        this.hub.listenForQuit(() => {
            this.setState({
                gameId: '',
                opponent: ''
            });
            this.lookForOpponent();
        });
    }

    setMove = async (i: number, j: number) => {
        let winning = this.isWinning();
        if(winning){
            if(winning == this.state.move) alert('You won!');
            else alert('You lost...');
            return;
        }
        let valid = this.moveValid();
        let { board } = this.state;
        if(!valid){
            alert('Not your move');
        } else if(board[i][j]) {
            alert('Position already taken');
        } else {
            board[i][j] = this.state.move;
            this.setState({
                board: board
            });
            await this.api.updateMove(this.state.username, this.state.gameId, board);
        }
    }

    quitGame = async() => {
        await this.api.quit(this.state.username, this.state.gameId);
    }

    getCharacterColor(i: number, j: number) {
        if (this.state.board[i][j] == 'X') return { color: 'red' };
        if (this.state.board[i][j] == 'O') return { color: 'blue' };
        return {};
    }

    moveValid() : boolean{
        let xCount=0, oCount=0, board=this.state.board;
        for(let i =0; i < board.length; i++){
          let row = board[i];
          for(let j =0; j<row.length; j++){
            if(row[j] == 'X') xCount++;
            if(row[j] == 'O') oCount++;
          }
        }
        // x goes first
        if(oCount%2 == 0 && xCount%2 == 0 && this.state.move == 'X') return true;

        // o goes next
        if(oCount%2 == 0 && xCount%2 == 1 && this.state.move == 'O') return true;

        // then x goes again
        if(oCount%2 == 1 && xCount%2 == 1 && this.state.move == 'X') return true;

        // then x goes again
        if(oCount%2 == 1 && xCount%2 == 0 && this.state.move == 'O') return true;

        return false;
      }


    isWinning(): string | undefined {
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
        for(let i=0; i<winningGrid.length; i++){
            let grid = winningGrid[i];
            let x = grid[0];
            const move = this.state.board[x.r][x.c];
            if(!move) continue;
            let y = grid[1];
            let z = grid[2];
            if(move === this.state.board[y.r][y.c] && move === this.state.board[z.r][z.c]){
                return move;
            }
        }
        return;
    }

    updateUsername = ({target} : {target: any}) : void => {
        this.setState({
            username: target.value
        })
    }

    render() {
        const { username, opponent, move, gameId, hasEnteredUsername, board } = this.state;
        let isWinning = this.isWinning();
        let moveValid = this.moveValid();
        return (
            <div>
                <h1 id="tableLabel">
                    Tic Tac Toe
                    { gameId &&
                     <p>
                         { moveValid && !isWinning &&
                            <span>
                                Your Move!
                            </span>
                         }
                         { !moveValid && !isWinning &&
                            <span>
                                Opponents turn...
                            </span>
                         }
                         { isWinning && isWinning == move &&
                            <span>
                                You won!!!
                            </span>
                         }
                          { isWinning && isWinning != move &&
                            <span>
                                You lost...
                            </span>
                         }
                     </p>
                    }
                </h1>
                { !hasEnteredUsername &&
                    <p>
                    <label>Please enter your username</label>
                    <input type="text" onChange={this.updateUsername} />
                    <input type="button" onClick={this.lookForOpponent} value="Search for opponent"/>
                    </p>
                }
                { hasEnteredUsername && opponent == '' &&
                    <p>
                        Searching for opponent...
                    </p>
                }
                { gameId &&
                    <div>
                        <p>You're playing as { username } ({ move })</p>
                        <p>You're opponent is { opponent }</p>
                        <table>
                            <tr>
                                <td
                                    onClick={() => this.setMove(0,0)}
                                    style={this.getCharacterColor(0,0)}
                                >
                                    { board[0][0] }
                                </td>
                                <td
                                    className="vert"
                                    onClick={() => this.setMove(0,1)}
                                    style={this.getCharacterColor(0,1)}
                                >
                                    { board[0][1] }
                                </td>
                                <td
                                    onClick={() => this.setMove(0,2)}
                                    style={this.getCharacterColor(0,2)}
                                >
                                    { board[0][2] }
                                </td>
                            </tr>
                            <tr>
                                <td
                                    className="hori"
                                    onClick={() => this.setMove(1,0)}
                                    style={this.getCharacterColor(1,0)}
                                >
                                    { board[1][0] }
                                </td>
                                <td
                                    className="vert hori"
                                    onClick={() => this.setMove(1,1)}
                                    style={this.getCharacterColor(1,1)}
                                >
                                    { board[1][1] }
                                </td>
                                <td
                                    className="hori"
                                    onClick={() => this.setMove(1,2)}
                                    style={this.getCharacterColor(1,2)}
                                >
                                    { board[1][2] }
                                </td>
                            </tr>
                            <tr>
                                <td
                                    onClick={() => this.setMove(2,0)}
                                    style={this.getCharacterColor(2,0)}
                                >
                                    { board[2][0] }
                                </td>
                                <td
                                    className="vert"
                                    onClick={() => this.setMove(2,1)}
                                    style={this.getCharacterColor(2,1)}
                                >
                                    { board[2][1] }
                                </td>
                                <td
                                    onClick={() => this.setMove(2,2)}
                                    style={this.getCharacterColor(2,2)}
                                >
                                    { board[2][2] }
                                </td>
                            </tr>
                        </table>
                    </div>
                }
            </div>
        )
    }
}