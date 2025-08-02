import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials:true
}))

app.use(express.json({
  limit:"16kb"
}))

app.use(express.urlencoded({
  extended:true,
  limit:"16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

//Routes import
import userRouter from './routes/user.routes.js'
import taskRouter from './routes/task.routes.js'
import documentRouter from './routes/document.routes.js'

// Routes Declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tasks", taskRouter)
app.use("/api/v1/documents", documentRouter)

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "TaskPilot API is running",
    timestamp: new Date().toISOString()
  })
})

export default app;