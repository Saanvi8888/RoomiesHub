const express = require("express")
const mongoose = require("mongoose")
const http = require("http");
const { Server } = require("socket.io");
const dotenv= require("dotenv")
dotenv.config();
const connectDB = require("./config/db")
const cors = require("cors");  
const authRoutes = require("./routes/authRoutes");
const houseRoutes = require("./routes/houseRoutes");
const expenseRoutes = require("./routes/expenseRoutes")
const notesRouter = require("./routes/notesRoutes")
const reminderRouter = require("./routes/reminderRoutes")
const activityRouter = require("./routes/activityRoutes")
const inventoryRouter = require("./routes/inventoryRoutes")
const notificationRouter = require("./routes/notificationRoutes")
const aiRouter = require("./routes/aiRoutes");
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
app.set("io", io);

io.on("connection", (socket) => {

  socket.on("joinHouse", (houseId) => {
    socket.join(houseId);

    
  });

  socket.on("disconnect", () => {
  });
});

app.use(express.json());

connectDB();
require("./utils/reminderCron");
app.use("/api/auth",authRoutes)
app.use("/api/house",houseRoutes)
app.use("/api/expense",expenseRoutes)
app.use("/api/notes",notesRouter)
app.use("/api/reminders",reminderRouter)
app.use("/api/activity",activityRouter)
app.use("/api/inventory",inventoryRouter)
app.use("/api/notifications",notificationRouter);
app.use("/api/ai",aiRouter);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
