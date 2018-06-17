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
				refs.map.props.setTempLocation(e);

				if (refs.map.props.mapState.firstTrial) {
					refs.map.props.setMapState({
						...refs.map.props.mapState,
						firstTrial: false,
						center: {
							lat: e.latLng.lat(),
							lng: e.latLng.lng()
						},
						zoom: 9,
					});
				}
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
		zoom={props.mapState.zoom}
		center={props.mapState.center}
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

export default MapComponent;