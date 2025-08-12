const map = L.map('cluster-map').setView([32.0, 53.0], 5); 
// Initialize a Leaflet map centered roughly on Iran with zoom level 5
// 'cluster-map' is the ID of the HTML element where the map will render

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
// Add OpenStreetMap tile layer to the map with proper attribution

// Create a marker cluster group to efficiently manage many markers with clustering
const markers = L.markerClusterGroup();

// Loop through the campgrounds array (passed from backend or client-side)
// and add a marker for each campground that has valid geo coordinates
campgrounds.forEach(camp => {
  if (!camp.geometry || !camp.geometry.coordinates) return; // skip if no coordinates

  const [lng, lat] = camp.geometry.coordinates; // Coordinates stored as [longitude, latitude]

  // Create a marker at the given lat/lng, bind a popup with campground title and province name (admin_name)
  const marker = L.marker([lat, lng]).bindPopup(
    `<strong>${camp.title}</strong><br>استان: ${camp.admin_name}`
  );

  // Add this marker to the marker cluster group
  markers.addLayer(marker);
});

// Add the clustered markers layer to the map
map.addLayer(markers);

