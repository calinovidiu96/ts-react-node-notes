import { Router } from "express";
import { check, param } from "express-validator";
import { Types } from "mongoose";

import {
	getNotes,
	getNoteById,
	createNote,
	updateNote,
	deleteNote,
} from "../controllers/notes-controller";

const router = Router();

// Get All Notes
router.get("/", getNotes);

// Get one Note by Note ID
router.get(
	"/note/:id",
	[
		param("id").exists(),
		param("id").custom((value) => {
			if (!Types.ObjectId.isValid(value)) {
				throw new Error("Invalid ID");
			}
			return true;
		}),
	],
	getNoteById
);

// Create Note
router.post(
	"/create",
	[
		check("title").isLength({ min: 3 }),
		check("content").isLength({ min: 3 }),
	],
	createNote
);

// Update Note
router.patch(
	"/update/:id",
	[
		param("id").exists(),
		param("id").custom((value) => {
			if (!Types.ObjectId.isValid(value)) {
				throw new Error("Invalid ID");
			}
			return true;
		}),
		check("title").optional().isString().isLength({ min: 3 }),
		check("content").optional().isLength({ min: 3 }),
	],
	updateNote
);

// Delete Note
router.delete(
	"/delete/:id",
	[
		param("id").exists(),
		param("id").custom((value) => {
			if (!Types.ObjectId.isValid(value)) {
				throw new Error("Invalid ID");
			}
			return true;
		}),
	],
	deleteNote
);

export default router;
