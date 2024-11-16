import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { error } from "console";

type UserConnectionType = {
  user: string;
  chatRoom: string;
};

class ChatHab {
  private hubConnection: HubConnection;
  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5153/chat")
      .withAutomaticReconnect()
      .build();
    this.hubConnection.on("ReceiveMessage", (user, message) => {
      console.log("🚀 ~ joinChat ~ user,message:", user, message);
    });
  }
  public async invokeConnectToChat({ chatRoom, user }: UserConnectionType) {
    try {
      await this.hubConnection.start();
      await this.hubConnection.invoke("JoinChat", { chatRoom, user });
      return {
        connection: this.hubConnection,
        lading: false,
        error: false,
        chatRoom,
      };
    } catch (error) {
      console.log("🚀 ~ joinChat ~ error:", error);
      return { error: true, loading: false, message: error };
    }
  }
}
export default ChatHab;
