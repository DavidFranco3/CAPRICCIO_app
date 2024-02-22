import React, { useState } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

function Map() {
  const [location, setLocation] = useState(null);

  const handleMapClick = event => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  };

  return (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
      onClick={handleMapClick}
      google={window.google} // <--- añadir esta línea
    >
      {location && <Marker position={location} />}
    </GoogleMap>
  );
}

const MapWithMarker = withGoogleMap(Map);

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSaveLocation = () => {
    setSelectedLocation(location);
  };

  return (
    <div>
      <MapWithMarker
        containerElement={<div style={{ height: '400px' }} />}
        mapElement={<div style={{ height: '100%' }} />}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${YOUR_API_KEY}&libraries=geometry,drawing,places`} // <--- Reemplazar YOUR_API_KEY con tu clave de API
        loadingElement={<div style={{ height: '100%' }} />}
      />
      <button onClick={handleSaveLocation}>Guardar ubicación</button>
      {selectedLocation && (
        <p>
          Ubicación seleccionada: Latitud {selectedLocation.lat}, Longitud{' '}
          {selectedLocation.lng}
        </p>
      )}
    </div>
  );
}

export default App;
