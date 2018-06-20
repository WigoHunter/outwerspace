import React from "react";
import PropTypes from "prop-types";
import { compose, withProps, withHandlers } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import mapStyle from "../../map.json";
import { keys } from "../../keys.json";

// Wrapper for state changes
class MapComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			firstTrial: true,
			center: { lat: 0, lng: 0 },
			zoom: 2,
		};

		this.setMapState = this.setMapState.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.userLocation != prevProps.userLocation)
			console.log("get location succesfully", this.props.userLocation); //eslint-disable-line
	} 

	setMapState(state) {
		this.setState(state);
	}

	render() {
		return <Map
			{...this.props}
			mapState={this.state}
			setMapState={this.setMapState}
		/>;
	}
}

MapComponent.propTypes = {
	isMarkerShown: PropTypes.bool,
	setTempLocation: PropTypes.func,
	tempLocation: PropTypes.object,
	userLocation: PropTypes.object,
};

const Map = compose(
	withProps({
		googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${keys.googlemap}&v=3.exp&libraries=geometry,drawing,places`,
		loadingElement: <div style={{ height: "100%" }} />,
		containerElement: <div style={{ height: "100vh" }} />,
		mapElement: <div style={{ height: "100%" }} />,
	}),
	withHandlers(() => {
		const refs = {
			map: undefined,
		};

		return {
			onMapMounted: () => ref => {
				refs.map = ref;
			},
			onClicked: () => (e) => {
				refs.map.props.setTempLocation({
					lat: e.latLng.lat(),
					lng: e.latLng.lng(),
				});

				refs.map.panTo({
					lat: e.latLng.lat(),
					lng: e.latLng.lng()
				});

				if (refs.map.props.mapState.zoom < 9) {
					refs.map.props.setMapState({
						...refs.map.props.mapState,
						zoom: 9
					});
				}

				// START HERE: toast.success("確定滴家？") two button: succes then update Mongo, else nothing (keep clicking the map).
			}
		};
	}),
	withScriptjs,
	withGoogleMap
)((props) => 
	<GoogleMap
		ref={props.onMapMounted}
		onClick={props.onClicked}
		setTempLocation={props.setTempLocation}
		setMapState={props.setMapState}
		mapState={props.mapState}
		zoom={props.userLocation == null ? props.mapState.zoom : 15}
		center={props.userLocation == null ? props.mapState.center : props.userLocation}
		defaultOptions={{
			styles: mapStyle,
			fullscreenControl: false,
			fullscreenControlOptions: false,
			mapTypeControl: false,
			mapTypeControlOptions: false,
		}}
	>
		{props.isMarkerShown && props.tempLocation != null &&
			<Marker
				position={{ lat: props.tempLocation.lat, lng: props.tempLocation.lng}}
				onClick={props.onClick}
			/>
		}
	</GoogleMap>
);

// All users marker: title: id, icon: Facebook profile pic,
// onClick: Route push /profile/user_id
export default MapComponent;