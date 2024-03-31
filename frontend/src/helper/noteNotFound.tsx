import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Alert, Button } from "react-bootstrap";

const NotFound: React.FC = () => {
	return (
		<Row className="justify-content-center align-items-center vh-100">
			<Col md={6}>
				<Alert variant="danger" className="text-center">
					This note can't be found
				</Alert>
				<div className="text-center mt-3">
					<Link to="/">
						<Button variant="primary">Go to Notes List</Button>
					</Link>
				</div>
			</Col>
		</Row>
	);
};

export default NotFound;
