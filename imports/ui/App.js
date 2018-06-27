import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { toast } from "react-toastify";
import MapComponent from "./MapComponent";
import Forum from "./Forum";
import "react-toastify/dist/ReactToastify.css";

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
			userInputtingLocation: false,
			tempLocation: null,				// location of the pin for user input
			userLocation: null,				// the absolute location got from browser
			confirmingLocation: false,
			userContext: {
				// user != null => user logged in
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
		this.confirmLocation = this.confirmLocation.bind(this);
		this.setUserLocation = this.setUserLocation.bind(this);
		this.userStartInputtingLocation = this.userStartInputtingLocation.bind(this);
		this.userEndInputtingLocation = this.userEndInputtingLocation.bind(this);
	}

	login() {
		this.setState({ login: true });
	}

	logout() {
		this.setState({ login: false });
	}

	userStartInputtingLocation() {
		this.setState({ userInputtingLocation: true });
	}

	userEndInputtingLocation() {
		this.setState({ userInputtingLocation: false });
	}

	setUserLocation() {
		this.userEndInputtingLocation();
		this.setState({
			userContext: {
				...this.state.userContext,
				user: {
					...this.state.userContext.user,
					location: this.state.tempLocation
				}
			}
		});

		Meteor.call("user.setLocation", {
			id: this.state.userContext.user.userId,
			location: this.state.tempLocation
		});
	}

	confirmLocation() {
		if (!this.state.confirmingLocation) {
			// Library specific usage
			this.confirmLocationToast = toast.success(({}) => // eslint-disable-line
				<div className="toast-for-location">
					希望將自己定位在這嗎？
					<p>未來也還能更動</p>
					<div>
						<button onClick={() => { this.setUserLocation(); }}>是</button>
						<button onClick={() => { this.setState({ confirmingLocation: false }); }}>不是</button>
					</div>
				</div>,
			{
				autoClose: false,
				position: "top-left",
				closeButton: <span></span>
			}
			);
		}

		this.setState({ confirmingLocation: true });
	}

	getUserCurrentLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((res) => {
				this.setTempLocation({ lat: res.coords.latitude, lng: res.coords.longitude });
				this.setState({ userLocation: {
					lat: res.coords.latitude,
					lng: res.coords.longitude,
				}});

				this.confirmLocation();
				this.userStartInputtingLocation();
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
					userInputtingLocation={this.state.userInputtingLocation}
					userStartInputtingLocation={this.userStartInputtingLocation}
					getUserCurrentLocation={this.getUserCurrentLocation}
				/>
				<MapComponent
					users={this.props.users}
					userInputtingLocation={this.state.userInputtingLocation}
					confirmLocation={this.confirmLocation}
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