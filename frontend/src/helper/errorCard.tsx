import React from "react";
import { Card, Col } from "react-bootstrap";

interface ErrorCardProps {
	title: string;
	text: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ title, text }) => {
	return (
		<Col md={6} className="mx-auto">
			<Card>
				<Card.Body>
					<Card.Title>{title}</Card.Title>
					<Card.Text>{text}</Card.Text>
				</Card.Body>
			</Card>
		</Col>
	);
};

export default ErrorCard;
