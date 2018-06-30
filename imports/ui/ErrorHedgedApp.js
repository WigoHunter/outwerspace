import React from "react";
import App from "./App";

class ErrorHedgedApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			error: false,
		};
	}

	componentDidCatch(error, info) {
		this.setState({ error: true });
		// TODO: Meteor call 'error.occur' to inform me.
		console.log(info);			// eslint-disable-line
	}

	render() {
		if (this.state.error) {
			return <h1>Something went wrong. Kevin is working on it.</h1>;
		} else {
			return <App />;
		}
	}
}

export default ErrorHedgedApp;