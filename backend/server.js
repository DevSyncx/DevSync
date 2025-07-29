// Entry point of the backend server
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongoDB.js";
import userRouter from "./routes/userRouter.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
await connectDB();

// Route to display the initial message on browser
app.get("/", (req, res) => {
  res.send("DEVSYNC BACKEND API");
});

app.use("/api/user", userRouter);

// TODO: Add routes and middleware

app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});
