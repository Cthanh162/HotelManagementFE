import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect(token) {
    if (this.connection && this.isConnected) {
      // console.log("SignalR already connected.");
      return;
    }
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/notifications", {
        accessTokenFactory: () => token,
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      this.isConnected = true;
      // console.log("SignalR connected.");
    } catch (error) {
      // console.error("Error connecting SignalR:", error);
    }
  }

  on(event, callback) {
    if (this.connection) {
      this.connection.off(event);
      this.connection.on(event, callback);
    } else {
      // console.warn("Connection not established. Unable to register event.");
    }
  }

  disconnect() {
    if (this.connection) {
      this.connection.stop();
      this.isConnected = false;
      // console.log("SignalR disconnected.");
    }
  }
}

const signalRService = new SignalRService();
export default signalRService;
