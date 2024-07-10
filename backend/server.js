import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from 'body-parser';   


import authRoutes from "./routes/auth.route.js";
import fileRoutes from "./routes/files.route.js";


import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/transfer", fileRoutes);

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    connectMongoDB();
})