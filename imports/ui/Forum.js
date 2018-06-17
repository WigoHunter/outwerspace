import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import FacebookLogin from "react-facebook-login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { UserContext } from "./App";

class Forum extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hide: false
		};
		
		this.toggleForum = () => {
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
		};

		this.toggleForum = this.toggleForum.bind(this);
		this.responseFacebook = this.responseFacebook.bind(this);
		this.initLocation = this.initLocation.bind(this);
	}

	responseFacebook(res) {
		// reset: https://graph.facebook.com/me/permissions?method=delete&access_token=EAAGfyczjlbsBADl2EC2JAUPhhC1sZAlnF5crdoPxAk83K6BTLxWYIE1HXmCEGNF9kBCgXRZAjqvKqLvoSFAodgFeC6ZBxAkoT3ZBvzx0Tf7PzS7ZCqhaZBsfRekeqa3Osswmpp6Jf3J9wb90GfafZAe43hPKLEmb6ZBz3J3DpKw14AW16WXOmhbgaDsbqvuXO1O8YqKxbQEOEwZDZD
		console.log(res, res.accessToken); // eslint-disable-line

		if (res.accessToken) {
			this.props.login();
		
			if (!this.props.users.some(user => user.userId === res.id)) {
				let usrObj = {
					userId: res.id,
					fb_link: res.link,
					pic: res.picture.data.url,
					location: null
				};
	
				Meteor.call("users.insert", usrObj);
				this.props.user.setUser(usrObj);
			} else {
				this.props.user.setUser(this.props.users.find(user => user.userId === res.id));
			}
		}
	}

	initLocation() {
		this.setState({ hide: true });
	}

	render() {
		return (
			<div className={`forum ${this.state.hide && "hide"}`}>
				<ToastContainer />
				<p className="close" onClick={() => this.toggleForum()}>＋</p>
				{
					this.props.loggedin
						?
						this.props.user.location == null
							?
							<div className="ask-for-location">
								<h2>最後一個步驟！</h2>
								<p>也告訴大家你在哪吧</p>
								<button onClick={() => this.initLocation()}>Start</button>
							</div>
							:
							<div></div>
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
								callback={this.responseFacebook}
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
	login: PropTypes.func,
	loggedin: PropTypes.bool,
};

const forumWithContext = props => (
	<UserContext.Consumer>
		{user => <Forum {...props} user={user} />}
	</UserContext.Consumer>
);

export default forumWithContext;