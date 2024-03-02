import express from "express"
import z from "zod"
import { User, users } from "../user"
import bcrypt from "bcrypt"
import { HandleError } from "../utils/errors"
import { requireUserAuth, sessions } from "../session"
import crypto from "crypto"

const authRouter = express.Router()

const SignUpUserSchema = z.object({
  username: z.string().min(6).max(15),
  password: z.string().min(7),
})

const LoginUserSchema = z.object({
  username: z.string(),
  password: z.string(),
})

authRouter.post("/auth/signup", async (req, res) => {
  const signUpUser = SignUpUserSchema.safeParse(req.body)
  
  if (!signUpUser.success) {
    return res.status(400).json("invalid format: username must be between 6 and 15 characters and password must be greater than 7")
  }

  if (users.some((user) => user.username === signUpUser.data.username)) {
    return res.status(400).json("a user with that name already exists")
  }

  const [hashedPassword, err] = await HandleError(bcrypt.hash(signUpUser.data.password, 10))

  if (err !== null) {
    console.log(err)
    return res.status(500).json("server error")
  }

  const newUser: User = {
    username: signUpUser.data.username,
    password: hashedPassword,
  }

  users.push(newUser)

  return res.status(200).json("successfully created account")
})

authRouter.post("/auth/login", async (req, res) => {
  const loginUser = LoginUserSchema.safeParse(req.body)
  
  if (!loginUser.success) {
    return res.status(400).json("invalid format")
  }

  const user = users.find((user) => user.username === loginUser.data.username)

  if (user === undefined) {
    return res.status(400).json("incorrect username or password")
  }

  const [success, err] = await HandleError(bcrypt.compare(loginUser.data.password, user.password))

  if (err !== null) {
    console.log(err)
    return res.status(500).json("server error")
  }

  if (!success) {
    return res.status(400).json("incorrect username or password")
  }

  const sessionId = crypto.randomUUID()
  const csrfToken = crypto.randomUUID()

  sessions.push({
    sessionId,
    csrfToken,
    userId: user.username,
  })

  res.status(200).cookie("sessionId", sessionId, {
    httpOnly: true,
    sameSite: true,
    secure: true,
  }).cookie("csrfToken", csrfToken, {
    sameSite: true,
    secure: true,
  }).json({
    userId: user.username
  })
})

authRouter.delete("/auth/logout", requireUserAuth, (req, res) => {
  const idx = sessions.findIndex((session) => session.userId === res.locals.user.username)
  sessions.splice(idx, 1)
  
  res.cookie("csrfToken", "null").cookie("sessionId", "null").json("successfully logged out")
})

export { authRouter }