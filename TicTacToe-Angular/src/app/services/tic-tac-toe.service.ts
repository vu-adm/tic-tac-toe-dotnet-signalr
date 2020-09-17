import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class TicTacToeService {
    public baseUrl: string;
    constructor(private http: HttpClient) { 
        this.baseUrl = 'https://localhost:5001/api/game'
    }

    startGame(username: string): Observable<Game> {
        return this.http.get<Game>(`${this.baseUrl}/start/${username}`);
    }

    updateMove(username: string, gameId: string, board: string[][]) : Observable<any> {
        console.log(board);
        return this.http.put<any>(`${this.baseUrl}/move/${username}/${gameId}`, board);
    }

    test(username: string) :Observable<string> {
        return this.http.get<string>(`${this.baseUrl}/test/${username}`);
    }
}

interface Game {
    id: string,
    opponents: string[]
}