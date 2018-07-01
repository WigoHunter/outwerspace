import React from "react";
import PropTypes from "prop-types";
import FacebookLogin from "react-facebook-login";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { UserContext } from "./App";

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
				{
					this.props.loggedin
						?
						this.props.user.user && this.props.user.user.location == null
							?
							<div className="ask-for-location">
								<h2>最後一個步驟！</h2>
								<p>也告訴大家你在哪吧</p>
								<button onClick={() => this.initLocation()}>Start</button>
							</div>
							:
							<div>感謝！{/* START HERE: Done. And guide users to input his/her profile */}</div>
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
								callback={this.props.responseFacebook}
							/>
						</div>
				}
			</div>
		);
	}
}

Forum.propTypes = {
	users: PropTypes.array,
	user: PropTypes.object,
	loggedin: PropTypes.bool,
	getUserCurrentLocation: PropTypes.func,
	userStartInputtingLocation: PropTypes.func,
	userInputtingLocation: PropTypes.bool,
	responseFacebook: PropTypes.func,
};

const forumWithContext = props => (
	<UserContext.Consumer>
		{user => <Forum {...props} user={user} />}
	</UserContext.Consumer>
);

export default forumWithContext;