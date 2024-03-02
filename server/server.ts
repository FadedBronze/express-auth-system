import express from "express"
import { authRouter } from "./routes/auth" 
import bodyParser from "body-parser"
import path from "path"
import helmet from "helmet"
import sessionMiddleware, { requireUserAuth, sessions } from "./session"
import cookie from "cookie-parser"

const app = express()

app.use(helmet())
app.use(bodyParser.json())
app.use(cookie())
app.use(sessionMiddleware)
app.use(authRouter)

app.get("/client/*", (req, res) => {
  return res.sendFile(path.join(__dirname, "..", req.path))
})

app.get("/secret", requireUserAuth, (req, res) => {
  console.log(res.locals.user)
  res.status(200).json("you get the secret")
})

app.listen(3000, () => {
  console.log("running on port 3000") 
})