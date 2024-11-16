import { HubConnectionBuilder } from "@microsoft/signalr";
import "./App.css";
import ConnectForm from "./components/ConnectForm/ConnectForm";
import { ThemeProvider } from "./components/providers/ThemeProvieder";
import { Card, CardContent, CardHeader } from "./components/ui/card";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <section className="flex w-full h-screen justify-center items-center">
        <Card className="min-w-[300px]">
          <CardHeader>
            <h1 className="font-[600] text-2xl">Connect to chat</h1>
          </CardHeader>
          <CardContent>
            <ConnectForm />
          </CardContent>
        </Card>
      </section>
    </ThemeProvider>
  );
}

export default App;
