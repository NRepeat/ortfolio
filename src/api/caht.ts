import { Actions, State } from "@/store/slice/chat";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "react-toastify";

export type UserConnectionType = {
  user: string;
  chatRoom: string;
};
export type ChatHubMessages = {
  user: string;
  message: string;
};

class ChatHab {
  private hubConnection: HubConnection;
  private chatState: State & Actions;
  constructor(chatState: State & Actions) {
    this.chatState = chatState;
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5153/chat")
      .withAutomaticReconnect()
      .build();
    this.hubConnection.on("ReceiveAdminMessage", (user, message) => {
      console.log("🚀 ~ joinChat ~ ReceiveAdminMessage:", user, message);

      toast(`User ${user} connected to ${message} chat`);
    });
    this.hubConnection.on("ReceiveClientMessage", (user, message) => {
      console.log("🚀 ~ joinChat ~ ReceiveMessage:", user, message);
      chatState.setChatMessage(message);
    });
  }
  public async invokeConnectToChat({ chatRoom, user }: UserConnectionType) {
    try {
      this.chatState.setLoading(true);
      await this.hubConnection.start();
      await this.hubConnection.invoke("JoinChat", { chatRoom, user });
      this.chatState.setLoading(false);
      return {
        connection: this.hubConnection,
        lading: false,
        error: false,
        chatRoom,
      };
    } catch (error) {
      console.log("🚀 ~ joinChat ~ error:", error);
      this.chatState.setLoading(false);
      return { error: true, loading: false, message: error };
    }
  }
  public async sendMessageToChat({ message }: { message: string }) {
    try {
      this.chatState.setLoading(true);
      if (this.chatState.connection) {
        await this.chatState.connection.invoke("SendMessage", message);
        this.chatState.setLoading(false);
        return {
          connection: this.hubConnection,
          lading: false,
          error: false,
        };
      } else {
        throw new Error("Connection not found");
      }
    } catch (error) {
      console.log("🚀 ~ joinChat ~ error:", error);
      this.chatState.setLoading(false);
      return { error: true, loading: false, message: error };
    }
  }
}
export default ChatHab;
