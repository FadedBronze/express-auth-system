import express from "express"
import { z } from "zod"
import { users } from "./user"

const SessionSchema = z.object({
  sessionId: z.string(),
  csrfToken: z.string(),
  userId: z.string()
})

export default function sessionMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const sessionId = z.string().safeParse(req.cookies.sessionId)
  const csrfToken = z.string().safeParse(req.get("X-CSRF-Token"))

  if (!sessionId.success || !csrfToken.success) {
    return next()
  }
  
  const session = {
    sessionId: sessionId.data,
    csrfToken: csrfToken.data,
  }

  res.locals.session = session
  next()
}

export function requireUserAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const session = sessions.find(session => res.locals.session.sessionId === session.sessionId)
  
  if (!(session && session.csrfToken === res.locals.session.csrfToken)) {
    return res.status(400).json("Authentication Failed: Please Reauthenticate")
  }

  const user = users.find((user) => user.username === session.userId)

  if (!user) {
    return res.status(400).json("Authentication Failed: Please Reauthenticate")
  }

  res.locals.user = user
  next()
}

export type Session = z.infer<typeof SessionSchema>

export const sessions: Session[] = []