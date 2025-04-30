import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import getLocalIPAddress from "./utils/getLocalIPAddress.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const ip = getLocalIPAddress();

app.use(express.json());
app.use(cookieParser());

// Debugging Purposes only
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// app.get("/", (req, res) => {
//     res.send("Hello World");
// });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server running on => ${ip}:${PORT}`);
});
