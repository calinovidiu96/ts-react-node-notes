import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface INote {
	_id: string;
	title: string;
	content: string;
}

interface EditNoteModalProps {
	show: boolean;
	handleClose: () => void;
	handleNoteEdit: (updatedNote: INote) => void;
	note: INote;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
	show,
	handleClose,
	handleNoteEdit,
	note,
}) => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [titleError, setTitleError] = useState("");
	const [contentError, setContentError] = useState("");
	const [isValid, setIsValid] = useState(false);

	useEffect(() => {
		setTitle(note.title);
		setContent(note.content);
	}, [note]);

	const validateFields = useCallback(() => {
		const titleValid = title.length >= 3;
		const contentValid = content.length >= 3;

		setIsValid(titleValid && contentValid);
	}, [title, content]);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setTitle(value);
		setTitleError(
			value.length < 3 ? "Title must be at least 3 characters long" : ""
		);
		validateFields();
	};

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setContent(value);
		setContentError(
			value.length < 3 ? "Content must be at least 3 characters long" : ""
		);
		validateFields();
	};

	const handleSubmit = async () => {
		try {
			if (!isValid) return;

			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/notes/update/${note._id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						title,
						content,
					}),
				}
			);
			if (!response.ok) {
				throw new Error("Failed to update note");
			}
			const updatedNote = { ...note, title, content };
			handleNoteEdit(updatedNote);
			handleClose();
		} catch (error) {
			console.error("Error updating note:", error);
		}
	};

	// Update validity whenever input fields change
	useEffect(() => {
		validateFields();
	}, [title, content, validateFields]);

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Edit Note</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="title">
						<Form.Label>Title</Form.Label>
						<Form.Control
							type="text"
							value={title}
							onChange={handleTitleChange}
						/>
						{titleError && (
							<Form.Text className="text-danger">
								{titleError}
							</Form.Text>
						)}
					</Form.Group>
					<Form.Group controlId="content" className="mt-2">
						<Form.Label>Content</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							value={content}
							onChange={handleContentChange}
						/>
						{contentError && (
							<Form.Text className="text-danger">
								{contentError}
							</Form.Text>
						)}
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button
					variant="primary"
					onClick={handleSubmit}
					disabled={!isValid}
				>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default EditNoteModal;
