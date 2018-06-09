import React from "react";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import mapStyle from "../../map.json";

// Wrapper for state changes
class MapComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <Map />;
	}
}

const Map = compose(
	withProps({
		googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: "100%" }} />,
		containerElement: <div style={{ height: "100vh" }} />,
		mapElement: <div style={{ height: "100%" }} />,
	}),
	withScriptjs,
	withGoogleMap
)((props) => 
	<GoogleMap
		defaultZoom={2}
		defaultCenter={{ lat: 0, lng: 0 }}
		defaultOptions={{
			styles: mapStyle,
			fullscreenControl: false,
			fullscreenControlOptions: false,
			mapTypeControl: false,
			mapTypeControlOptions: false,
		}}
	>
		{props.isMarkerShown &&
            <Marker position={{ lat: -34.397, lng: 150.644}} onClick={props.onClick} />
		}
	</GoogleMap>
);

export default MapComponent;