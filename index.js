import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/DB/connectDB.js";
import cors from "cors";
// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to the database
connectDB();
// CORS configuration to allow your frontend
app.use(
	cors({
	  origin: [
		"http://localhost:3000",  // Allow localhost for development
		"https://manegement-system.vercel.app",  // Allow Vercel URL for production
	  ], // Allow these specific frontend addresses
	  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
	  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
	  credentials: true,              // Allows cookies to be sent
	})
  );
  
// Middleware to log requests
const middleware = (req, res, next) => {
	console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
	next();
};

app.use(middleware);
app.use(express.json());

// Routes

// Home Route
app.get("/", (req, res) => {
	const obj = {
		name: "Asheel Ahmed Siddiqui",
		getReqTime: `Date: ${new Date().toDateString()}, Time: ${new Date().toLocaleTimeString()}`,
	};
	res.send(obj);
	console.log("GET request received");
});

// Start Server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
