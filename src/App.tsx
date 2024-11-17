import { ToastContainer } from "react-toastify";
import "./App.css";
import Chat from "./components/Chat/Chat";
import ConnectionCard from "./components/ConnectForm/Card";
import { ThemeProvider } from "./components/providers/ThemeProvieder";
import { useChatStore } from "./store/slice/chat";
import { useEffect } from "react";
import ChatHab from "./api/caht";
import sleep from "./lib/sleep";

function App() {
  const { connection, loading, chatRoom, messages, user } = useChatStore(
    (state) => state
  );
  const chatState = useChatStore((state) => state);
  console.log("🚀 ~ App ~ chatState:", chatState);
  // const chat = new ChatHab(chatState);
  // console.log("🚀 ~ App ~ connection:", connection?.invoke);

  // useEffect(() => {
  //   if (user && !connection?.invoke && chatRoom) {
  //     const rec = async () => {
  //       const connection = await chat.invokeConnectToChat({ chatRoom, user });
  //       if (connection.connection) {
  //         chatState.setConnection(connection.connection);
  //         await sleep();
  //         chatState.setChatRoom(connection.chatRoom);
  //       }
  //     };

  //     rec();
  //   }

  //   console.log("ref");
  // }, []);
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <section className="flex w-full h-screen justify-center items-center">
        <ToastContainer
          toastClassName="bg-primary"
          bodyClassName="bg-primary"
        />
        {connection && chatRoom ? (
          <Chat chatRoom={chatRoom} messages={messages} />
        ) : (
          <ConnectionCard />
        )}
      </section>
    </ThemeProvider>
  );
}

export default App;
