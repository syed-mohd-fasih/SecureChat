import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Debugging Purposes only
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World")
});


app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`)
});