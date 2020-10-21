import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
// import { GoogleComponent } from "react-google-location";
import { geolocated } from "react-geolocated";
import Geolocation from "../components/Geolocation";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends Component {
  constructor() {
    super();
    this.state = {
      center: {
        lat: 45,
        lng: 0,
      },
      zoom: 11,
    };
  }

  // updateCoords = () => {
  //   this.setState({
  //     center: {
  //       lat: this.props.coords.latitude,
  //       lng: this.props.coords.longitude,
  //     },
  //     zoom: 11,
  //   });
  // };

  // useEffect(() => {
  //   this.setState({
  //     center: {
  //       lat: this.props.coords.latitude,
  //       lng: this.props.coords.longitude,
  //     },
  //     zoom: 11,
  //   });
  // }, [this.props]);

  // changeCoordinates = () => {
  //   this.setState({center.lat: 45})
  // }

  // static defaultProps = {
  //   center: {
  //     lat: 59.95,
  //     lng: 30.33,
  //   },
  //   zoom: 11,
  // };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_KEY }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
        >
          <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
