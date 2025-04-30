import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

import getLocalIPAddress from "../utils/getLocalIPAddress.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const ip = getLocalIPAddress();

const origin_url = `http://${ip}:${PORT}`;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: origin_url,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("New client connected");

    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("message", (message) => {
        console.log("Message received:", message);
        io.emit("message", message);
    });
});

export { app, io, server };
