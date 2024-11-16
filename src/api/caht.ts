import { HubConnectionBuilder } from "@microsoft/signalr";

type UserConnectionType = {
  user: string;
  chatRoom: string;
};
const joinChat = async ({ chatRoom, user }: UserConnectionType) => {
  const hubConnection = new HubConnectionBuilder()
    .withUrl("http://localhost:5153/chat")
    .withAutomaticReconnect()
    .build();
  try {
    await hubConnection.start();
    await hubConnection.invoke("JoinChat", { chatRoom, user });
  } catch (error) {
    console.log("🚀 ~ joinChat ~ error:", error);
    throw new Response("Bad request", { status: 500 });
  }
};

const chatApi = { joinChat };
export default chatApi;
