<template>
  <div id="map-container">
    <div id="map" style="width: 100%; height: 600px;"></div>
  </div>
</template>
  
<script>
import mapboxgl from 'mapbox-gl'; 
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'; 
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'; 
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
  
export default {
  name: 'MapView',
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibW9sbHkxMDUiLCJhIjoiY20yOGdvbXozMW03eTJsb3I2dWZiamlwYSJ9.BA9MDzaQl_Nt7Ix8VtcZNQ';  
  
    const map = new mapboxgl.Map({
      container: 'map',  
      style: 'mapbox://styles/mapbox/streets-v11',  
      center: [144.9631, -37.8136],  
      zoom: 12  
    });
  
    map.addControl(new mapboxgl.NavigationControl());
  
    // add search feature
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Search for places'  
    });
  
    map.addControl(geocoder);
  
    // add navigate feature
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',  
      profile: 'mapbox/driving', 
      controls: {
        inputs: true,  
        instructions: true,  
      }
    });

    map.addControl(directions, 'top-left');
  }
}
</script>
  
<style scoped>
#map-container {
    width: 100%;
    height: 600px;
 }
  
#map {
    width: 100%;
    height: 100%;
}
</style>
  