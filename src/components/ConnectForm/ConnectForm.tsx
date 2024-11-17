import formSchema from "@/service/connect-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useChatStore } from "@/store/slice/chat";
import { Loader2 } from "lucide-react";
import ChatHab from "@/api/caht";
import { v4 as uuidv4 } from "uuid";

const ConnectForm = () => {
  const chatState = useChatStore((state) => state);
  const chat = new ChatHab(chatState);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      chatRoom: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const uuid = uuidv4();
    const connection = await chat.invokeConnectToChat({
      chatRoom: values.chatRoom,
      user: { name: values.user, uid: uuid },
    });
    if (connection.connection) {
      chatState.setChatRoom(connection.chatRoom);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-lg">Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="chatRoom"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-lg">Chat name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>This is chat connection name.</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" disabled={chatState.loading}>
          <div className="w-[70px] flex justify-center items-center">
            {chatState.loading ? (
              <>
                <Loader2 className="animate-spin" />
              </>
            ) : (
              <>Connect</>
            )}
          </div>
        </Button>
      </form>
    </Form>
  );
};

export default ConnectForm;
