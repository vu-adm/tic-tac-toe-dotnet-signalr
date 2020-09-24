import * as signalR from '@aspnet/signalr';

export default class SignalRService {
	hub() {
		return {
			startConnection: (username) => {
				console.log('starting connection');
				if (!username) return;
				this.hubConnection = new signalR.HubConnectionBuilder()
					.withUrl(`https://localhost:5001/game?username=${username}`)
					.build();
				this.hubConnection
					.start()
					.then(() => console.log('Connection started'))
					.catch(err => console.log(`Error while starting connection: ${err}`));
			},

			listenForGameStart: (callback) => {
				console.log('waiting for game');
				this.hubConnection.on('start-game', response => {
					console.log(response);
					callback(response, 'O');
				});
			},

			listenForUpdate: (callback) => {
				console.log('update move');
				this.hubConnection.on('update-game', response => {
					console.log(response);
					callback(response);
				});
			},

			listenForQuit: (callback) => {
				console.log('quiting');
				this.hubConnection.on('quit-game', () => {
					callback();
				});
			}
		};
	}
}