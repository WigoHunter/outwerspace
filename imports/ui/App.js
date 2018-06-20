import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { toast } from "react-toastify";
import MapComponent from "./MapComponent";
import Forum from "./Forum";

// Styles
import "../less/App.less";

// APIs
import { Users } from "../api/users";

export const UserContext = React.createContext();
export const UserLocationContext = React.createContext();

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loginned: false,
			tempLocation: null,
			userLocation: null,
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
		this.getUserCurrentLocation = this.getUserCurrentLocation.bind(this);
	}

	login() {
		this.setState({ login: true });
	}

	logout() {
		this.setState({ login: false });
	}

	getUserCurrentLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((res) => {
				this.setTempLocation({ lat: res.coords.latitude, lng: res.coords.longitude });
				this.setState({ userLocation: {
					lat: res.coords.latitude,
					lng: res.coords.longitude,
				}});
			});
		} else {
			toast.error("Oops, 看來您的瀏覽器不支援定位", {
				position: "top-left",
				autoClose: 5000,
				pauseOnHover: true
			});

			setTimeout(() => {
				this.startAdjustingLocation();
			}, 2000);
		}
	}

	setTempLocation(obj) {
		this.setState({
			tempLocation: obj
		});
	} 

	render() {
		return (
			<UserContext.Provider value={this.state.userContext}>
				<Forum
					loggedin={this.state.login}
					login={this.login}
					users={this.props.users}
					getUserCurrentLocation={this.getUserCurrentLocation}
				/>
				<MapComponent
					isMarkerShown
					userLocation={this.state.userLocation}
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