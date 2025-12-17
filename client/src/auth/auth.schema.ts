import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .endsWith("@nitk.edu.in", "Only NITK institute email allowed"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type AuthSchema = z.infer<typeof authSchema>;
