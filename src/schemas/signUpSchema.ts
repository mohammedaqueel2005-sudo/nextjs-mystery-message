import { email, z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(10, "Username must be no more than 10 characters")
    .regex(/^[A-Za-z0-9]+$/, "Username must not contain any special characters")

export const signUp = z.object({
    username: usernameValidation,
    email: z.email({
        message: "Invalid email address"
    }),
    password: z.string().min(6, { message : "Password must be atleast 6 characters" }),
});