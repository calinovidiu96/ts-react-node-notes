import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Spinner, Button } from "react-bootstrap";
import DeleteNoteModal from "../modals/DeleteNoteModal";
import EditNoteModal from "../modals/EditNoteModal";
import NotFound from "../../helper/noteNotFound";

interface INote {
	_id: string;
	title: string;
	content: string;
}

const SingleNote: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [note, setNote] = useState<INote | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [selectedNoteId, setSelectedNoteId] = useState<string>("");

	useEffect(() => {
		const fetchNote = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/notes/note/${id}`
				);
				if (!response.ok) {
					throw new Error("Note not found");
				}
				const data = await response.json();
				setNote(data.note);
			} catch (error) {
				console.error("Error fetching note:", error);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchNote();
	}, [id]);

	const handleEditClick = (
		event: React.MouseEvent<HTMLButtonElement>,
		id: string
	) => {
		setShowEditModal(true);
	};

	const handleDeleteClick = (
		event: React.MouseEvent<HTMLButtonElement>,
		id: string
	) => {
		setSelectedNoteId(id);
		setShowDeleteModal(true);
	};

	const handleEdit = (editedNote: INote) => {
		// Update the note with the edited values
		setNote(editedNote);
	};

	const handleDelete = () => {
		// Close the delete modal
		setShowDeleteModal(false);
		// Navigate back to the root URL
		navigate("/");
	};

	if (loading) {
		return (
			<div className="d-flex justify-content-center my-3">
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</div>
		);
	}

	if (error || !note) {
		return <NotFound />;
	}

	return (
		<Row className="justify-content-center align-items-center vh-100">
			<Col md={6}>
				<Card>
					<Card.Header className="d-flex justify-content-between">
						<Button
							variant="secondary"
							onClick={() => navigate("/")}
						>
							{"<- Back"}
						</Button>
						<div>
							<Button
								variant="primary"
								className="me-2"
								onClick={(event) =>
									handleEditClick(event, note._id)
								}
							>
								Edit
							</Button>
							<Button
								variant="danger"
								onClick={(event) =>
									handleDeleteClick(event, note._id)
								}
							>
								Delete
							</Button>
						</div>
					</Card.Header>
					<Card.Body>
						<Card.Title>{note.title}</Card.Title>
						<Card.Text>{note.content}</Card.Text>
					</Card.Body>
				</Card>
			</Col>
			<DeleteNoteModal
				show={showDeleteModal}
				handleClose={() => setShowDeleteModal(false)}
				handleDelete={handleDelete}
				noteId={selectedNoteId}
			/>
			<EditNoteModal
				show={showEditModal}
				handleClose={() => setShowEditModal(false)}
				handleNoteEdit={handleEdit}
				note={note}
			/>
		</Row>
	);
};

export default SingleNote;
