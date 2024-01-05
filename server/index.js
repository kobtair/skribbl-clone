const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`a new user has connected: ${socket.id}`);
  socket.on("send_message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data);
  });
  socket.on("start_drawing", (data) => {
    socket.broadcast.emit("client_start_drawing", data);
  });
  socket.on("finish_drawing", () => {
    socket.broadcast.emit("client_finish_drawing");
  });
  socket.on("draw", (data) => {
    socket.broadcast.emit("client_draw", data);
  });
  socket.on("disconnect", () => {
    console.log(`a user has disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log(`Listening at port ${process.env.PORT || "3001"}`);
});