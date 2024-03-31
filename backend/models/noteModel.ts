import { Schema, model } from "mongoose";

interface INote {
	title: string;
	content: string;
}

const noteSchema = new Schema<INote>({
	title: { type: String, required: true, minlength: 3 },
	content: { type: String, required: true, minlength: 3 },
});

export const Note = model<INote>("Note", noteSchema);
