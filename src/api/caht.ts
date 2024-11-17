import { Actions, MessageType, State } from "@/store/slice/chat";
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
type HubMessageType = {
  guid: string;
  userName: string;
  messageValue: string;
  time: Date;
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

    this.hubConnection.on("ReceiveAdminMessage", (data: HubMessageType) => {
      const { guid, userName, messageValue, time } = data;
      const dateTime = new Date(time);
      const date = dateTime.toLocaleDateString();
      const timeOnly = dateTime.toLocaleTimeString();
      if (!this.chatState.user) {
        this.chatState.setChatUser({ name: userName, uid: guid });
      }
      toast(
        `User ${userName} connected to ${messageValue} chat. \n${date}/${timeOnly}`
      );
    });
    this.hubConnection.on("ReceiveClientMessage", (data: HubMessageType) => {
      console.log("🚀 ~ ChatHab ~ this.hubConnection.on ~ dat:", data);
      const { guid, userName, messageValue, time } = data;
      const dateTime = new Date(time);
      const date = dateTime.toLocaleDateString();
      const timeOnly = dateTime.toLocaleTimeString();
      const messageObj: MessageType = {
        time: timeOnly,
        uid: guid,
        value: messageValue,
      };
      console.log(
        "🚀 ~ ChatHab ~ this.hubConnection.on ~ messageObj:",
        messageObj
      );
      chatState.setChatMessage(messageObj);
    });
    this.hubConnection.on("disconnect", (user, message, time) => {
      console.log("🚀 ~ joinChat ~ ReceiveMessage:", user, message, time);
      toast(`User ${user} disconnected from ${message} chat`);
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
  // public async reconnectToChat() {
  //   try {
  //     if()
  //   } catch (error) {}
  // }
  public async sendMessageToChat({ message }: { message: string }) {
    try {
      this.chatState.setLoading(true);
      if (this.chatState.connection) {
        console.log(
          "🚀 ~ ChatHab ~ sendMessageToChat ~ this.chatState.connection:",
          this.chatState.connection.connectionId
        );
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
  public async disconnectFromChat() {
    this.chatState.setLoading(true);
    if (this.chatState.connection) {
      await this.chatState.connection.stop();
      this.chatState.clearChatState();
      return {
        connection: this.hubConnection,
        lading: false,
        error: false,
      };
    } else {
      throw new Error("Connection not found");
    }
  }
}
export default ChatHab;
