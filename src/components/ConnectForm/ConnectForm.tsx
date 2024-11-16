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
import chatApi from "@/api/caht";

const ConnectForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      chatRoom: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await chatApi.joinChat(values);
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
        <Button type="submit">Connect</Button>
      </form>
    </Form>
  );
};

export default ConnectForm;
