import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface INote {
	_id: string;
	title: string;
	content: string;
}

interface CreateNoteModalProps {
	show: boolean;
	handleClose: () => void;
	handleNoteCreated: (newNote: INote) => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
	show,
	handleClose,
	handleNoteCreated,
}) => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [titleError, setTitleError] = useState("");
	const [contentError, setContentError] = useState("");
	const [isValid, setIsValid] = useState(false);

	useEffect(() => {
		validateFields();
	}, [title, content]);

	const validateFields = () => {
		const isTitleValid = title.trim().length >= 3;
		const isContentValid = content.trim().length >= 3;

		setIsValid(isTitleValid && isContentValid);
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setTitle(value);
		setTitleError(
			value.trim().length < 3
				? "Title must be at least 3 characters long"
				: ""
		);
	};

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setContent(value);
		setContentError(
			value.trim().length < 3
				? "Content must be at least 3 characters long"
				: ""
		);
	};

	const handleSubmit = async () => {
		try {
			if (isValid) {
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/notes/create`,
					{
						method: "POST",
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
					throw new Error("Failed to create note");
				}
				const data = await response.json();
				const newNote = { _id: data.note._id, title, content };

				handleNoteCreated(newNote);
				handleClose();

				setTitle("");
				setContent("");
			}
		} catch (error) {
			console.error("Error creating note:", error);
		}
	};

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create Note</Modal.Title>
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
					Submit
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateNoteModal;
