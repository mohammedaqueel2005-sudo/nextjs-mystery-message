import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.email(),
    password: z.string()
})