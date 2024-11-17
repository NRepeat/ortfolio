import { Actions, MessageType, State, UserType } from "@/store/slice/chat";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "react-toastify";

export type UserConnectionType = {
  user: UserType;
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
      const messageData = JSON.parse(messageValue);
      console.log(
        "🚀 ~ ChatHab ~ this.hubConnection.on ~ messageData:",
        messageData
      );
      this.chatState.setRoomIdUser(messageData.roomId);
      toast(
        `User ${userName} connected to ${messageValue} chat. \n${date}/${timeOnly}`
      );
    });
    this.hubConnection.on(
      "ReceiveDisconnectMessage",
      (data: HubMessageType) => {
        const messageData = JSON.parse(data.messageValue);
        console.log("🚀 ~ ChatHab ~ constructor ~ data:", data);
        // const { guid, userName, messageValue, time } = data;
        if (chatState.roomId === messageData.roomId) {
          chatState.clearChatState();
        }
        toast(`User  disconnected from  chat ${data.messageValue}`);
      }
    );
    console.log(
      "🚀 ~ ChatHab ~ constructor ~ this.hubConnection.state:",
      this.hubConnection.state
    );
    this.hubConnection.on("ReceiveClientMessage", (data: HubMessageType) => {
      const { guid, userName, messageValue, time } = data;
      const dateTime = new Date(time);
      const date = dateTime.toLocaleDateString();
      const timeOnly = dateTime.toLocaleTimeString();
      const messageObj: MessageType = {
        time: timeOnly,
        uid: guid,
        value: messageValue,
      };
      chatState.setChatMessage(messageObj);
    });
    this.hubConnection.onclose((error) => {
      console.log("🚀 ~ joinChat ~ ReceiveMessage:", error);
      chatState.clearChatState();
      toast(`User  disconnected from  chat`);
    });
  }
  public async reconnectToChat({ chatRoom, user }: UserConnectionType) {
    try {
      await this.hubConnection.start();
      await this.hubConnection.invoke("JoinChat", {
        chatRoom,
        user: user.name,
        chatId: user.uid,
      });
      this.chatState.setConnection(this.hubConnection);
    } catch (error) {}
  }
  public async invokeConnectToChat({ chatRoom, user }: UserConnectionType) {
    try {
      await this.hubConnection.start();

      await this.hubConnection.invoke("JoinChat", {
        chatRoom,
        user: user.name,
        chatId: user.uid,
      });
      this.chatState.setConnection(this.hubConnection);

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
      await this.chatState.connection?.invoke("SendMessage", message);
      return {
        connection: this.hubConnection,
        lading: false,
        error: false,
      };
    } catch (error) {
      console.log("🚀 ~ joinChat ~ error:", error);
      this.chatState.setLoading(false);
      return { error: true, loading: false, message: error };
    }
  }
  public async disconnectFromChat() {
    await this.hubConnection.stop();
    await this.chatState.connection?.stop();
    // this.chatState.clearChatState();
    return {
      connection: this.hubConnection,
      lading: false,
      error: false,
    };
  }
}
export default ChatHab;
