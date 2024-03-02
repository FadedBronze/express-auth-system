import { z } from "zod"

export const UserSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type User = z.infer<typeof UserSchema> 

export const users: User[] = []