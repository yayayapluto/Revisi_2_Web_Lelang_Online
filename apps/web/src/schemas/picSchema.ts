import {z} from "zod";

export const PicSchema = z.object({
    name: z
        .string()
        .min(3, {message: "Name must be at least 3 characters long"})
        .max(50, {message: "Name can't be longer than 50 characters"}),
    phone_number: z
        .string()
        .min(3, {message: "Phone number must be at least 6 digits"})
        .max(20, {message: "Phone number can't be longer than 2 characters"}),
});