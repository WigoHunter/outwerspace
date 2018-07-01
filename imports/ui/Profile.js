import React from "react";
import PropTypes from "prop-types";

class Profile extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {

		};
	}

	render() {
		// working on not getting FB login info
		console.log(this.props);	// eslint-disable-line
		if (!this.props.ready) {
			return <div />;
		}

		return (
			<div>感謝！{/* START HERE: Done. And guide users to input his/her profile */}</div>
		);
	}
}

Profile.propTypes = {
	ready: PropTypes.bool,
};

export default Profile;