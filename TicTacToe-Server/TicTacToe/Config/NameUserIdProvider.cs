using System;
using Microsoft.AspNetCore.SignalR;

namespace TicTacToe.Config {
	public class NameUserIdProvider : IUserIdProvider {
		public string GetUserId(HubConnectionContext connection) {
			var request = connection.GetHttpContext().Request;
			var qs = request.Query;
			var username = qs["username"];
			if(string.IsNullOrEmpty(username)) return qs["id"];
			return username;
		}
	}
}
