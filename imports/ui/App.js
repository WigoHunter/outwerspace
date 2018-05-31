import React from 'react';
import MapComponent from './MapComponent';

class App extends React.Component {
    render() {
        return (
            <div>
                <div style={{
                    position: "absolute",
                    height: "300px",
                    width: "200px",
                    background: "blue",
                    zIndex: 10000,
                    opacity: 0.7
                }} />
                <MapComponent />
            </div>
        )
    }
}

export default App;