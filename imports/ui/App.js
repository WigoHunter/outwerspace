import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import MapComponent from "./MapComponent";
import Forum from "./Forum";

// Styles
import "../less/App.less";

// APIs
import { Users } from "../api/users";

export const UserContext = React.createContext();

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loginned: false,
			tempLocation: null,
			userContext: {
				user: null,
				setUser: (user) => {
					this.setState({
						userContext: {
							...this.state.userContext,
							user: user
						}
					});
				} 
			}
		};

		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.setTempLocation = this.setTempLocation.bind(this);
	}

	login() {
		this.setState({ login: true });
	}

	logout() {
		this.setState({ login: false });
	}

	setTempLocation(e) {
		this.setState({
			tempLocation: e == null ? null : {
				lat: e.latLng.lat(),
				lng: e.latLng.lng(),
			}
		});
	} 

	render() {
		return (
			<UserContext.Provider value={this.state.userContext}>
				<Forum
					loggedin={this.state.login}
					login={this.login}
					users={this.props.users}
				/>
				<MapComponent
					isMarkerShown
					setTempLocation={this.setTempLocation}
					tempLocation={this.state.tempLocation}
				/>
			</UserContext.Provider>
		);
	}
}

App.propTypes = {
	users: PropTypes.array
};

export default withTracker(() => {
	Meteor.subscribe("users");

	return {
		users: Users.find({}).fetch(),
	};
})(App);