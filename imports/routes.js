import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import ErrorCatcher from "../imports/ui/helpers/ErrorCatcher";
import App from "../imports/ui/App";

const routes =
	<Router>
		<ErrorCatcher>
			<Switch>
				<Route exact path="/" component={App} />
			</Switch>
		</ErrorCatcher>
	</Router>;

export default routes;