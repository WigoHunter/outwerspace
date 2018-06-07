import React from "react";
import FacebookLogin from "react-facebook-login";
// import FontAwesomeIcon from "@fortawesome/react-fontawesome";

export default class Forum extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hide: false,
			login: false,
		};
		
		this.toggleForum = this.toggleForum.bind(this);
	}

	toggleForum() {
		this.setState({
			hide: !this.state.hide
		});
	}

	responseFacebook(res) {
		// reset: https://graph.facebook.com/me/permissions?method=delete&access_token=
		// geocoding response: https://maps.googleapis.com/maps/api/geocode/json?address=New%20York,%20New%20York
		console.log(res); // eslint-disable-line
	}

	render() {
		return (
			<div className={`forum ${this.state.hide && "hide"}`}>
				<p className="close" onClick={() => this.toggleForum()}>＋</p>
				{
					this.state.login
						?
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