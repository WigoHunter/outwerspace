import React from "react";
import MapComponent from "./MapComponent";

import "../less/App.less";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hideForum: false
		};

		this.toggleForum = this.toggleForum.bind(this);
	}

	toggleForum() {
		this.setState({
			hideForum: !this.state.hideForum
		});
	}

	render() {
		return (
			<div>
				<div className={`forum ${this.state.hideForum && "hide"}`}>
					<p className="close" onClick={() => this.toggleForum()}>＋</p>
				</div>
				<MapComponent />
			</div>
		);
	}
}

export default App;