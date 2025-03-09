import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = dev ? 3002 : 443;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(handle);
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    // Handle message events
    socket.on("message", (message) => {
      console.log("message received:", message);

      // Broadcast the message to all other clients
      socket.broadcast.emit("message", {
        ...message,
        sender: "other", // Change sender to 'other' for recipients
      });
    });

    socket.on("disconnect", () => {
      console.log("a user disconnected", socket.id);
    });
  });

  server
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
