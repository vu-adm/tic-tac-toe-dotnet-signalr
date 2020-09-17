import { Injectable } from "@angular/core";
import * as signalR from "@aspnet/signalr";

@Injectable({
  providedIn: "root"
})
export class SignalRService {
  data: ChartModel[];
  hubConnection: signalR.HubConnection;

  startConnection = (username: string) => {
    if(!username) return;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:5001/game?username=${username}`)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log("Connection started"))
      .catch(err => console.log(`Error while starting connection: ${err}`));
  };
}

export interface ChartModel {}
