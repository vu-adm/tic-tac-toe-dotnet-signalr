import axios from 'axios';

export default class ApiService {
	constructor() {
		this.http = axios.create();
		this.baseUrl = 'https://localhost:5001/api/game';
	}

	gameApi() {
		return {
			test: () => {
				return this.http.get(`${this.baseUrl}/test`);
			},
			lookForOpponent: (username) => {
				return this.http.get(`${this.baseUrl}/start/${username}`);
			},
			updateMove: (username, gameId, board) => {
				return this.http.put(`${this.baseUrl}/move/${username}/${gameId}`, board);
			},
			quitGame: (username, gameId) => {
				return this.http.post(`${this.baseUrl}/quit/${username}/${gameId}`);
			}
		};
	}
}