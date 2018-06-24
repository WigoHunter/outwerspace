import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import routes from "../imports/routes.js";

Meteor.startup(() => {
	render(routes, document.getElementById("react-root"));
});