import React from "react";
import { Modal, Button } from "react-bootstrap";

interface DeleteNoteModalProps {
	show: boolean;
	handleClose: () => void;
	handleDelete: () => void; // Function to handle note deletion
	noteId: string; // Id of the note to be deleted
}

const DeleteNoteModal: React.FC<DeleteNoteModalProps> = ({
	show,
	handleClose,
	handleDelete,
	noteId,
}) => {
	const handleConfirmDelete = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/notes/delete/${noteId}`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to delete note");
			}
			handleClose(); // Close the modal
			handleDelete(); // Call the handleDelete function to update the UI
		} catch (error) {
			console.error("Error deleting note:", error);
		}
	};

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Delete Note</Modal.Title>
			</Modal.Header>
			<Modal.Body>Are you sure you want to delete this note?</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Cancel
				</Button>
				<Button variant="danger" onClick={handleConfirmDelete}>
					Delete
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default DeleteNoteModal;
