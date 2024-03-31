import { RequestHandler, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { Note } from "../models/noteModel";

interface ICreateNote {
	title: string;
	content: string;
}

interface IUpdateNote {
	title?: string;
	content?: string;
}

export const getNotes: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const notes = await Note.find();

		if (!notes) {
			return res
				.status(404)
				.json({ message: "There are no notes available." });
		}

		res.status(200).json({
			message: "Notes fetched successfully!",
			notes,
		});
	} catch (err: any) {
		next(new Error(`Fetching notes failed. ${err.message}`));
	}
};

export const getNoteById: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { id } = req.params;

	try {
		const note = await Note.findById(id);

		if (!note) {
			return res
				.status(404)
				.json({ message: "There is no note with this ID." });
		}

		res.status(200).json({
			message: "Note fetched successfully!",
			note,
		});
	} catch (err: any) {
		next(new Error(`Fetching note failed. ${err.message}`));
	}
};

export const createNote: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { title, content } = req.body;

	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const newNote: ICreateNote = {
			title,
			content,
		};

		const note = await Note.create(newNote);

		res.status(201).json({
			message: "Note created successfully!",
			note: {
				_id: note._id,
				title: note.title,
				content: note.content,
			},
		});
	} catch (err: any) {
		next(new Error(`Create note failed.  ${err.message}`));
	}
};

export const updateNote: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			message: "Invalid inputs passed, please check your data.",
		});
	}

	const { id } = req.params;
	const { title, content } = req.body;

	try {
		const note = await Note.findById(id);

		if (!note) {
			return res.status(404).json({ message: "Can't find this note." });
		}

		const update: IUpdateNote = {
			title: title ?? undefined,
			content: content ?? undefined,
		};

		await Note.findOneAndUpdate({ _id: id }, update);

		res.status(201).json({
			message: "Note updated successfully!",
		});
	} catch (err: any) {
		next(new Error(`Update note failed.  ${err.message}`));
	}
};

export const deleteNote: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	try {
		const note = await Note.findById(id);

		if (!note) {
			return res.status(404).json({ message: "Can't find this note." });
		}

		await Note.findByIdAndDelete(id);

		res.status(201).json({
			message: "Note deleted successfully!",
		});
	} catch (err: any) {
		next(new Error(`Delete note failed.  ${err.message}`));
	}
};
