import { CardHeader, CardContent, Card } from "../ui/card";
import ConnectForm from "./ConnectForm";

const ConnectionCard = () => {
  return (
    <Card className="min-w-[300px]">
      <CardHeader>
        <h1 className="font-[600] text-2xl">Connect to chat</h1>
      </CardHeader>
      <CardContent>
        <ConnectForm />
      </CardContent>
    </Card>
  );
};

export default ConnectionCard;
