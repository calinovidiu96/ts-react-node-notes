import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import mongoose from "mongoose";

import notesRoutes from "./routes/notes-routes";

const app = express();

// DB connection
mongoose.connect(process.env.DB_STRING as string);

const db = mongoose.connection;

db.on("error", (err: mongoose.Error) => {
	console.error("Connection error:", err);
});

db.once("open", () => {
	console.log("Connected to database.");
});

//CORS
app.use((req: Request, res: Response, next: NextFunction) => {
	res.setHeader("Access-Control-Allow-Origin", "*"); // Will let it "*" just in dev.
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

	next();
});

app.use(bodyParser.json());

app.use("/notes", notesRoutes);

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send("Something went wrong. Please try again later.");
});

app.listen(5001, () => {
	console.log("Listen on PORT", 5001);
});
app.on("error", (e) => console.error("Error", e));

export default app;
