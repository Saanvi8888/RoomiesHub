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

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
app.set("io", io);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinHouse", (houseId) => {
    socket.join(houseId);

    console.log(
      `Socket ${socket.id} joined house ${houseId}`
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
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
server.listen(5000,()=>{
    console.log(`Server connected at Port 5000`)
})
