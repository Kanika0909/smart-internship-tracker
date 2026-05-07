const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
require("dotenv").config();
dotenv.config();

const connectDB = require("./config/db");

connectDB();



const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend-url.vercel.app"],
    credentials: true,
  }),
);

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const appRoutes = require("./routes/appRoutes");
app.use("/api/apps", appRoutes);

const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

const http = require("http").createServer(app);

const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected");
});

app.set("io", io);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
