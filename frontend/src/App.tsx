import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotesList from "./components/NotesList";
import SingleNote from "./components/SingleNote";

function App() {
	return (
		<div className="px-5 mt-5">
			<Router>
				<Routes>
					<Route path="/" Component={NotesList} />
					<Route path="/note/:id" Component={SingleNote} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
