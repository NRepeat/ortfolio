import { z } from "zod";

const formSchema = z.object({
  message: z.string().min(1).max(250),
});

export default formSchema;
