import PropTypes from 'prop-types';
import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

export default class Control extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formatted_address: props.formatted_address || '',
      address_components: props.address_components || {},
      lat: props.lat || NaN,
      lng: props.lng || NaN,
    };
  }
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    forID: PropTypes.string,
    formatted_address: PropTypes.string,
    address_components: PropTypes.object,
    lat: PropTypes.number,
    lng: PropTypes.number,
    classNameWrapper: PropTypes.string.isRequired,
  }

  handleChange = formatted_address => {
    this.setState({ formatted_address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => {
        console.log(results[0]);
        this.setState({
          // formatted_address: results[0].formatted_address,
          formatted_address: address,
          address_components: results[0].address_components,
        });
        return getLatLng(results[0]);
      })
      .then(latLng => {
        this.setState({
          lat: latLng.lat,
          lng: latLng.lng,
        });
        console.log('Success', latLng)
      })
      .catch(error => console.error('Error', error));
  };

  render() {
    const {
      forID,
      formatted_address,
      address_components,
      lat,
      lng,
      onChange,
      classNameWrapper,
    } = this.props;

    return (
      <div>
      <PlacesAutocomplete
        value={this.state.formatted_address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        searchOptions={{
          types: ['address'],
          location: new google.maps.LatLng(-34.603722, -58.38), // Río de la Plata
          radius: 2000,
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Empezá a tipear una dirección para ver sugerencias.',
                className: classNameWrapper,
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Buscando sugerencias...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <input
        type="hidden"
        id="gmaps-lat"
        className={classNameWrapper}
        value={lat}
      />
      <input
        type="hidden"
        id="gmaps-lng"
        className={classNameWrapper}
        value={lng}
      />
      </div>
    );
  }
}