document.addEventListener("DOMContentLoaded", function () {
  const ding = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

  const map = L.map("map").setView([33.8886, 35.4955], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  const search = new GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
    style: "bar",
    searchLabel: "Enter destination…",
    updateMap: true
  });
  map.addControl(search);

  map.on("geosearch/showlocation", result => {
    const dest = `${result.location.y.toFixed(5)},${result.location.x.toFixed(5)}`;
    document.getElementById("destination").value = dest;
    L.marker([result.location.y, result.location.x])
      .addTo(map)
      .bindPopup("📍 Destination")
      .openPopup();
  });

  alert("Requesting location...");

  navigator.geolocation.getCurrentPosition(
    pos => {
      alert("Location permission granted.");
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      document.getElementById("pickup").value = `${lat},${lng}`;
      L.marker([lat, lng]).addTo(map)
        .bindPopup("📍 Pickup")
        .openPopup();
    },
    error => {
      alert("Location permission denied or GPS unavailable.");
      document.getElementById("pickup").value = "GPS unavailable";
    }
  );

  document.getElementById("rideForm").addEventListener("submit", e => {
    e.preventDefault();
    alert("Submitting your ride request...");

    const ride = {
      name: clientName.value,
      phone: clientPhone.value,
      pickup: pickup.value,
      destination: destination.value,
      time: pickupTime.value,
      status: "waiting"
    };

    fetch("https://liwaa.kesug.com/save.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ride)
    }).then(() => {
      alert("Ride submitted successfully!");
      rideForm.style.display = "none";
      confirmation.style.display = "block";
      ding.play();
    }).catch(() => {
      alert("❌ Error submitting your ride. Please try again.");
    });
  });
});
