import { useChatStore } from "@/store/slice/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Input } from "../ui/input";
import formSchema from "@/service/input-chat-form";

const InputForm = () => {
  const chatState = useChatStore((state) => state);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {};
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center justify-between w-full"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="message" />
                </FormControl>
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
              <Send />
            )}
          </div>
        </Button>
      </form>
    </Form>
  );
};

export default InputForm;
