import React from "react";
import MapComponent from "./MapComponent";

import "../less/App.less";

class App extends React.Component {
	render() {
		return (
			<div>
				<div className="forum">
				</div>
				<MapComponent />
			</div>
		);
	}
}

export default App;