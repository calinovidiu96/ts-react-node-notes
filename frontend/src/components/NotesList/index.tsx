import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Button, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CreateNoteModal from "../modals/CreateNoteModal";
import ErrorCard from "../../helper/errorCard";
import DeleteNoteModal from "../modals/DeleteNoteModal";

interface INote {
	_id: string;
	title: string;
	content: string;
}

const NotesList = (): React.ReactElement => {
	const [notesList, setNotesList] = useState<INote[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);
	const [showCreateNoteModal, setShowCreateNoteModal] =
		useState<boolean>(false);
	const [showNoteCreatedNotification, setShowNoteCreatedNotification] =
		useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [selectedNoteId, setSelectedNoteId] = useState<string>("");

	const navigate = useNavigate();

	useEffect(() => {
		const fetchNotes = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/notes/`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch notes");
				}
				const data = await response.json();
				setNotesList(data.notes);
			} catch (error) {
				console.error("Error fetching notes:", error);
				setError(true);
			} finally {
				setLoading(false);
			}
		};
		fetchNotes();
	}, []);

	const truncateText = (text: string, maxLength: number) => {
		if (text.length > maxLength) {
			return text.substring(0, maxLength) + "...";
		}
		return text;
	};

	const handleRowClick = (noteId: string) => {
		navigate(`/note/${noteId}`);
	};

	// ***** CREATE handle functions *****
	const handleCreateNote = () => {
		setShowCreateNoteModal(true);
	};

	const handleCloseCreateNoteModal = () => {
		setShowCreateNoteModal(false);
	};

	const handleNoteCreated = (newNote: INote) => {
		setNotesList([...notesList, newNote]);
		setShowNoteCreatedNotification(true);
		setTimeout(() => {
			setShowNoteCreatedNotification(false);
		}, 3000);
	};
	// ***** END CREATE handle functions *****

	// ***** DELETE handle functions *****
	const handleDeleteClick = (
		event: React.MouseEvent<HTMLButtonElement>,
		id: string
	) => {
		event.stopPropagation();
		setSelectedNoteId(id); // Set the selected note id
		setShowDeleteModal(true); // Show the delete modal
	};

	const handleDelete = () => {
		// Remove the note from the list
		setNotesList(notesList.filter((note) => note._id !== selectedNoteId));
	};
	// ***** END DELETE handle functions *****

	if (loading) {
		return (
			<div className="d-flex justify-content-center my-3 ">
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</div>
		);
	}

	if (error) {
		return <ErrorCard title="Uups..." text="Something went wrong." />;
	}

	if (notesList.length === 0) {
		return (
			<>
				<Row className="justify-content-center mb-3">
					<Col xs="auto">
						<Button variant="primary" onClick={handleCreateNote}>
							Create Note
						</Button>
					</Col>
				</Row>
				<CreateNoteModal
					show={showCreateNoteModal}
					handleClose={handleCloseCreateNoteModal}
					handleNoteCreated={handleNoteCreated}
				/>
				<ErrorCard title="Uups..." text="There are no notes yet." />
			</>
		);
	}

	return (
		<>
			{showNoteCreatedNotification && (
				<Alert
					variant="success"
					onClose={() => setShowNoteCreatedNotification(false)}
					dismissible
				>
					Note created successfully!
				</Alert>
			)}
			<Row className="justify-content-center mb-3">
				<Col xs="auto">
					<Button variant="primary" onClick={handleCreateNote}>
						Create Note
					</Button>
				</Col>
			</Row>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th className="col-3">Title</th>
						<th className="col-7">Content</th>
						<th className="col-2">Actions</th>
					</tr>
				</thead>
				<tbody>
					{notesList.map((note, index) => (
						<tr
							key={index}
							onClick={() => handleRowClick(note._id)}
						>
							<td>{note.title}</td>
							<td>{truncateText(note.content, 100)}</td>
							<td className="d-flex justify-content-around">
								<Button
									variant="danger"
									onClick={(event) =>
										handleDeleteClick(event, note._id)
									}
								>
									Delete
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			<CreateNoteModal
				show={showCreateNoteModal}
				handleClose={handleCloseCreateNoteModal}
				handleNoteCreated={handleNoteCreated}
			/>
			<DeleteNoteModal
				show={showDeleteModal}
				handleClose={() => setShowDeleteModal(false)}
				handleDelete={handleDelete}
				noteId={selectedNoteId}
			/>
		</>
	);
};

export default NotesList;
