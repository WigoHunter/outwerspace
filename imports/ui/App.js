import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { ToastContainer, toast } from "react-toastify";
import MapComponent from "./MapComponent";
import Forum from "./Forum";
import Loading from "./helpers/Loading";
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
			waitingForLocation: false,
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
		this.responseFacebook = this.responseFacebook.bind(this);
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

	// Process Facebook Response
	responseFacebook(res) {
		// reset: https://graph.facebook.com/me/permissions?method=delete&access_token=EAAGfyczjlbsBADl2EC2JAUPhhC1sZAlnF5crdoPxAk83K6BTLxWYIE1HXmCEGNF9kBCgXRZAjqvKqLvoSFAodgFeC6ZBxAkoT3ZBvzx0Tf7PzS7ZCqhaZBsfRekeqa3Osswmpp6Jf3J9wb90GfafZAe43hPKLEmb6ZBz3J3DpKw14AW16WXOmhbgaDsbqvuXO1O8YqKxbQEOEwZDZD
		console.log(res, res.accessToken); // eslint-disable-line

		if (res.accessToken) {
			this.login();
		
			if (!this.props.loading) {
				if (!this.props.users.some(user => user.userId === res.id)) {
					let usrObj = {
						userId: res.id,
						fb_link: res.link,
						location: null,
					};
		
					Meteor.call("users.insert", usrObj);
					this.state.userContext.setUser({...usrObj, curLocation: null});
				} else {
					this.state.userContext.setUser({
						...this.props.users.find(user => user.userId === res.id),
						curLocation: null,
					});
				}
			}
		}
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
			this.setState({ waitingForLocation: true });
			navigator.geolocation.getCurrentPosition((res) => {
				this.setTempLocation({ lat: res.coords.latitude, lng: res.coords.longitude });
				this.setState({
					waitingForLocation: false,
					userLocation: {
						lat: res.coords.latitude,
						lng: res.coords.longitude,
					}
				});

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
				{this.state.waitingForLocation && <Loading />}
				<ToastContainer />
				<Forum
					loggedin={this.state.login}
					user={this.state.userContext}
					users={this.props.users}
					userInputtingLocation={this.state.userInputtingLocation}
					userStartInputtingLocation={this.userStartInputtingLocation}
					getUserCurrentLocation={this.getUserCurrentLocation}
					responseFacebook={this.responseFacebook}
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
	users: PropTypes.array,
	loading: PropTypes.bool,
};

export default withTracker(() => {
	const sub = Meteor.subscribe("users");
	const loading = !sub.ready();

	return {
		users: Users.find({}).fetch(),
		loading
	};
})(App);