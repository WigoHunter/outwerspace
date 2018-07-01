import React from "react";
import PropTypes from "prop-types";
import FacebookLogin from "react-facebook-login";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropsRoute from "./helpers/PropsRoute";
import { withRouter } from "react-router-dom";
import Profile from "./Profile";
// import FontAwesomeIcon from "@fortawesome/react-fontawesome";

class Forum extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hide: false,
		};

		this.toggleForum = this.toggleForum.bind(this);
		this.initLocation = this.initLocation.bind(this);
	}

	componentDidUpdate(prevProps) {
		// If user inputting location completes, open the forum.
		if (prevProps.userInputtingLocation == true && this.props.userInputtingLocation == false && this.props.user.user.location != null) {
			this.setState({ hide: false });
			this.props.history.push("/profile");
		}

		if (this.props.user.user && this.props.user.user.location != null) {
			this.props.history.push("/profile");
		}
	}

	toggleForum() {
		if (this.props.loggedin) {
			this.setState({
				hide: !this.state.hide
			});
		} else if (!toast.isActive(this.toastId)) {
			this.toastId = toast.warn("Please Login First :)", {
				position: "top-left",
				draggable: false,
			});
		}
	}

	initLocation() {
		this.setState({ hide: true });

		if (!toast.isActive(this.toastId)) {
			// Library specific usage
			this.toastId = toast.success(({}) => // eslint-disable-line
				<div className="toast-for-location">
					希望透過瀏覽器定位輔助？
					<p>定位後也會再給您微調</p>
					<div>
						<button onClick={() => this.props.getUserCurrentLocation()}>願意</button>
						<button onClick={() => this.startAdjustingLocation()}>手動操作</button>
					</div>
				</div>,
			{
				autoClose: false,
				position: "top-left"
			}
			);
		}
	}

	startAdjustingLocation() {
		this.props.userStartInputtingLocation();

		toast.success("請開始手動點選地圖、微調您的地點 :)", {
			position: "top-left",
			autoClose: 5000,
			pauseOnHover: true
		});
	}

	render() {
		return (
			<div className={`forum ${this.state.hide && "hide"}`}>
				<div className="tools">
					<div className="top">
						<p className="close" onClick={() => this.toggleForum()}>＋</p>
					</div>
					<div className="bot">
						{this.props.user.user &&
							<div className="user-pic" style={{ background: `url(https://res.cloudinary.com/outwerspace/image/facebook/w_30,h_30,r_max/${this.props.user.user.userId}.png)` }}></div>
						}
					</div>
				</div>
				{/* <Switch>  SHOULD USE SWITCH HERE */}
				<PropsRoute path="/" component={Welcome} loggedin={this.props.loggedin} user={this.props.user} responseFacebook={this.props.responseFacebook} initLocation={this.initLocation} hidden={this.props.user.user != null && this.props.user.user.location != null} />
				<PropsRoute path="/profile" component={Profile} loggedin={this.props.loggedin} user={this.props.user} ready={this.props.user.user != null && this.props.user.user.location != null} />
				{/* Catch user not logged in. Could use error catcher (i.e. error -> back to "/") / */}
			</div>
		);
	}
}

const Welcome = ({ loggedin, user, responseFacebook, initLocation, hidden }) => {
	{/* TODO: IF USER HASNT HAD A PROFILE, COME IN at "/", it's going to just return <div />. But should ask user to fill in profile */}
	if (hidden) {
		return <div />;
	}

	return loggedin
		?
		// If user hasn't had a location
		user.user && user.user.location == null &&
			<div className="ask-for-location">
				<h2>最後一個步驟！</h2>
				<p>也告訴大家你在哪吧</p>
				<button onClick={() => initLocation()}>Start</button>
			</div>
			// If the user has both. Should just render back to map.
		:
		<div className="welcome">
			<h2>歡迎來到 <span>OutwerSpace</span></h2>
			<p>屬於台灣留學生的小天地</p>
			<FacebookLogin
				appId="457164051420603"
				autoLoad={true}
				fields="name,email,picture,link,education,location"
				scope="public_profile,email,user_link,user_location"
				cssClass="facebook-button"
				callback={responseFacebook}
			/>
		</div>;
};

Welcome.propTypes = {
	loggedin: PropTypes.bool,
	user: PropTypes.object,
	responseFacebook: PropTypes.func,
	initLocation: PropTypes.func,
	hidden: PropTypes.bool,
};

Forum.propTypes = {
	users: PropTypes.array,
	user: PropTypes.object,
	loggedin: PropTypes.bool,
	getUserCurrentLocation: PropTypes.func,
	userStartInputtingLocation: PropTypes.func,
	userInputtingLocation: PropTypes.bool,
	responseFacebook: PropTypes.func,
	history: PropTypes.object,
};

export default withRouter(Forum);