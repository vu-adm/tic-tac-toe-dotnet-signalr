import * as signalR from "@aspnet/signalr";


export class SignalRService {
    hubConnection: any;

    startConnection = (username: string) => {
        if (!username) return;
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`https://localhost:5001/game?username=${username}`)
            .build();
        this.hubConnection
            .start()
            .then(() => console.log("Connection started"))
            .catch((err: any) => console.log(`Error while starting connection: ${err}`));
    };

    listenForGameStart = (callback: Function) => {
        console.log('waiting for game');
        this.hubConnection.on('start-game', (response: any) => {
            callback(response, 'O');
        });
    };

    listenForUpdate = (callback: Function) => {
        console.log('update move');
        this.hubConnection.on('update-game', (response: any) => {
            callback(response);
        });
    };

    listenForQuit = (callback: Function) => {
        console.log('quiting');
        this.hubConnection.on('quit-game', () => {
            callback();
        });
    };
}
