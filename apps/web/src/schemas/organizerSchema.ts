import {z} from "zod";

export const OrganizerSchema = z.object({
    name: z
        .string()
        .min(3, {message: "Name must be at least 3 characters long"})
        .max(50, {message: "Name can't be longer than 50 characters"}),
    address: z
        .string()
        .min(3, {message: "Address must be at least 3 characters long"})
        .max(100, {message: "Address can't be longer than 100 characters"}),
    bank_name: z
        .string()
        .min(3, {message: "Bank name must be at least 3 characters long"})
        .max(50, {message: "Bank name can't be longer than 50 characters"}),
    account_number: z
        .string()
        .min(6, {message: "Account number must be at least 6 digits"})
        .max(20, {message: "Account number can't be longer than 20 digits"}),
    account_name: z
        .string()
        .min(3, {message: "Account name must be at least 3 characters long"})
        .max(50, {message: "Account name can't be longer than 50 characters"})
});