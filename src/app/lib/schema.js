import z from "zod";

export const accountSchema = z.object({
    name: z.string().min(1, "Please provide the Name to continue"),
    type: z.enum(["SAVINGS", "CURRENT"]),
    balance: z.string().min(1, "Please provide Initial Balance to continue"),
    isDefault: z.boolean().default(false),
});