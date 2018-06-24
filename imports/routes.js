import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import App from "../imports/ui/App.js";

const routes =
	<Router>
		<Switch>
			<Route exact path="/" component={App} />
			{/* with profile id */}
		</Switch>
	</Router>

export default routes;