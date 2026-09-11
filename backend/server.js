import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import generalRequestRouter from "./routes/generalRequestRoute.js";

const app = express();

const port = process.env.PORT || 4000;

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinUserRoom", (userId) => {
    if (!userId) return;

    const roomName = `user:${userId}`;

    socket.join(roomName);

    console.log(
      `Socket ${socket.id} joined room ${roomName}`,
    );
  });

  socket.on("disconnect", () => {
    console.log(
      "Socket disconnected:",
      socket.id,
    );
  });
});


app.set("io", io);


connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/general-request",generalRequestRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

server.listen(port, () => {
  console.log(`Server Started ${port}`);
});
