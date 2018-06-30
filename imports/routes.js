import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import ErrorHedgedApp from "../imports/ui/ErrorHedgedApp";

const routes =
	<Router>
		<Switch>
			<Route exact path="/" component={ErrorHedgedApp} />
			{/* with profile id */}
		</Switch>
	</Router>;

export default routes;