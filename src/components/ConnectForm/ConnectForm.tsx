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
import sleep from "@/lib/sleep";
import ChatHab from "@/api/caht";

const ConnectForm = () => {
  const chat = new ChatHab();
  const chatState = useChatStore((state) => state);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      chatRoom: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    chatState.setLoading(true);
    const connection = await chat.invokeConnectToChat(values);
    if (connection.connection) {
      chatState.setConnection(connection.connection);
      await sleep();
      chatState.setLoading(false);
      chatState.setChatRoom(connection.chatRoom);
    } else if (connection.error) {
      await sleep();
      chatState.setLoading(false);
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
