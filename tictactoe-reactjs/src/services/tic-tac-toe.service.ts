import axios, { AxiosInstance } from 'axios';

export class TicTacToeService {
    private http: AxiosInstance;
    private baseUrl: string;

    constructor() {
        this.http = axios.create();
        this.baseUrl = 'https://localhost:5001/api/game'
    }

    async test() {
        return await this.http.get<any>(`${this.baseUrl}/test/test`);
    }

    startGame(username: string) {
        return this.http.get<Game>(`${this.baseUrl}/start/${username}`);
    }

    updateMove(username: string, gameId: string, board: string[][]) {
        console.log(board);
        return this.http.put<any>(`${this.baseUrl}/move/${username}/${gameId}`, board);
    }

    quit(username: string, gameId: string) {
        return this.http.post<any>(`${this.baseUrl}/quit/${username}/${gameId}`, null);
    }
}

interface Game {
    id: string,
    opponents: string[],
    board: string[][]
}