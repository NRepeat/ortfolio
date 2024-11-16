import { z } from "zod";

const formSchema = z.object({
  user: z.string().min(2).max(50),
  chatRoom: z.string().min(2).max(50),
});

export default formSchema;
