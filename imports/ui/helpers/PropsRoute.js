import React from "react";
import { Route } from "react-router-dom";

const renderMergedProps = (component, ...rest) => {
	const finalProps = Object.assign({}, ...rest);
	return (
		React.createElement(component, finalProps)
	);
};

const PropsRoute = ({ component, ...rest }) => {	// eslint-disable-line
	return (
		<Route {...rest} render={routeProps => {
			return renderMergedProps(component, routeProps, rest);
		}} />
	);
};

export default PropsRoute;