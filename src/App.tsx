import { ToastContainer } from "react-toastify";
import "./App.css";
import Chat from "./components/Chat/Chat";
import ConnectionCard from "./components/ConnectForm/Card";
import { ThemeProvider } from "./components/providers/ThemeProvieder";
import { useChatStore } from "./store/slice/chat";

function App() {
  const { connection, loading, chatRoom, messages } = useChatStore(
    (state) => state
  );
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
