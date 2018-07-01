import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
// import routes from "../imports/routes.js";
import ErrorCatcher from "../imports/ui/helpers/ErrorCatcher";
import App from "../imports/ui/App";
import { BrowserRouter as Router } from "react-router-dom";

const app =
	<Router>
		<ErrorCatcher>
			<App />
		</ErrorCatcher>
	</Router>;
	

Meteor.startup(() => {
	render(app, document.getElementById("react-root"));
});